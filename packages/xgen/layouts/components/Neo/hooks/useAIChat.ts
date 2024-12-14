import { useGlobal } from '@/context/app'
import { getToken } from '@/knife'
import { App } from '@/types'
import { useMemoizedFn, useAsyncEffect } from 'ahooks'
import to from 'await-to-js'
import axios from 'axios'
import ntry from 'nice-try'
import { useEffect, useMemo, useRef, useState } from 'react'
import { message } from 'antd'
import { RcFile, UploadFile } from 'antd/es/upload'

type Args = {
	/** The Chat ID **/
	chat_id?: string
	/** Upload options **/
	upload_options?: {
		process_image?: boolean
		max_file_size?: number // in MB
		allowed_types?: string[]
		[key: string]: any
	}
}

export default ({ chat_id, upload_options = {} }: Args) => {
	const event_source = useRef<EventSource>()
	const [messages, setMessages] = useState<Array<App.ChatInfo>>([])
	const [loading, setLoading] = useState(false)
	const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([])
	const [uploading, setUploading] = useState(false)

	const global = useGlobal()

	/** Get Neo API **/
	const neo_api = useMemo(() => {
		const api = global.app_info.optional?.neo?.api
		if (!api) return
		if (api.startsWith('http')) return api
		return `/api/${window.$app.api_prefix}${api}`
	}, [global.app_info.optional?.neo?.api])

	/** Get AI Chat History **/
	const getHistory = useMemoizedFn(async () => {
		if (!chat_id) return

		const endpoint = `${neo_api}/history?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}`
		const [err, res] = await to<App.ChatHistory>(axios.get(endpoint))
		if (err) return
		if (!res?.data) return
		setMessages(res.data.map(({ role, content }) => ({ is_neo: role === 'assistant', text: content })))
	})

	/** Get AI Chat Data **/
	const getData = useMemoizedFn((message: App.ChatHuman) => {
		setLoading(true)
		const contentRaw = encodeURIComponent(message.text)
		const contextRaw = encodeURIComponent(JSON.stringify(message.context))
		const token = getToken()
		const status_endpoint = `${neo_api}/status?content=${contentRaw}&context=${contextRaw}&token=${token}&chat_id=${chat_id}`
		const endpoint = `${neo_api}?content=${contentRaw}&context=${contextRaw}&token=${token}&chat_id=${chat_id}`

		// First check if the endpoint is accessible
		fetch(status_endpoint, { credentials: 'include', headers: { Accept: 'application/json' } })
			.then((response) => {
				if (!response.ok) {
					return response
						.json()
						.catch(() => {
							throw new Error(`HTTP ${response.status}`)
						})
						.then((data) => {
							if (data?.code && data?.message) {
								throw new Error(data.message, { cause: { isApiError: true } })
							}
							throw new Error(`HTTP ${response.status}`)
						})
				}
				// If response is ok, proceed with EventSource
				setupEventSource()
			})
			.catch((error) => {
				let errorMessage = 'Network error, please try again later'

				if (error.cause?.isApiError) {
					// Use the error message directly from API
					errorMessage = error.message
				} else if (error.message.includes('401')) {
					errorMessage = 'Session expired: Please login again'
				} else if (error.message.includes('403')) {
					errorMessage = 'Access denied: Please check your permissions or login again'
				} else if (error.message.includes('500')) {
					errorMessage = 'Server error: The service is temporarily unavailable'
				} else if (error.message.includes('404')) {
					errorMessage = 'AI service not found: Please check your configuration'
				} else if (error.name === 'TypeError') {
					errorMessage = 'Connection failed: Please check your network connection'
				}

				setMessages((prevMessages) => [
					...prevMessages,
					{
						text: errorMessage,
						type: 'error',
						is_neo: true
					}
				])
				setLoading(false)
			})

		const setupEventSource = () => {
			// Close existing connection if any
			event_source.current?.close()

			const es = new EventSource(endpoint, {
				withCredentials: true // Enable credentials for EventSource
			})
			event_source.current = es

			es.onopen = () => messages.push({ is_neo: true, text: '' })

			es.onmessage = ({ data }: { data: string }) => {
				const formated_data = ntry(() => JSON.parse(data)) as App.ChatAI
				if (!formated_data) return

				const { text, confirm, type, actions, done } = formated_data
				const current_answer = messages[messages.length - 1] as App.ChatAI
				if (done) {
					if (text) {
						current_answer.text = text
					}
					if (type) {
						current_answer.type = type
					}
					current_answer.confirm = confirm
					current_answer.actions = actions
					setMessages([...messages])
					setLoading(false)
					es.close()
					return
				}

				if (!text) return
				if (text.startsWith('\r')) {
					current_answer.text = text.replace('\r', '')
				} else {
					current_answer.text = current_answer.text + text
				}
				const message_new = [...messages]
				if (message_new.length > 0) {
					message_new[message_new.length - 1] = { ...current_answer }
					setMessages(message_new)
				}
			}

			es.onerror = (ev) => {
				const message_new = [
					...messages,
					{
						text: 'Connection lost. Please check your network and try again.',
						type: 'error',
						is_neo: true
					}
				]
				setMessages(message_new)
				setLoading(false)
				es.close()
			}
		}
	})

	/** Cancel the AI Chat **/
	const cancel = useMemoizedFn(() => {
		setLoading(false)
		event_source.current?.close()
	})

	useAsyncEffect(async () => {
		if (!neo_api) return
		getHistory()
	}, [neo_api])

	/** Get AI Chat Data **/
	useEffect(() => {
		if (!messages.length) return

		const latest_message = messages.at(-1)!

		if (latest_message.is_neo) return

		getData(latest_message)
	}, [messages])

	/** Clean up the AI Chat **/
	useEffect(() => {
		return () => event_source.current?.close()
	}, [])

	/** Upload files to Neo API **/
	const uploadFile = useMemoizedFn(async (file: RcFile) => {
		if (!neo_api) {
			throw new Error('Neo API endpoint not configured')
		}

		// Default options
		const options = {
			process_image: false,
			max_file_size: 10, // 10MB
			allowed_types: ['image/*', '.pdf', '.doc', '.docx', '.txt'],
			...upload_options
		}

		// Validate file size
		const maxSize = options.max_file_size * 1024 * 1024 // Convert to bytes
		if (file.size > maxSize) {
			throw new Error(`File size cannot exceed ${options.max_file_size}MB`)
		}

		// Validate file type
		const isValidType = options.allowed_types.some((type) => {
			if (type.includes('*')) {
				return file.type.startsWith(type.replace('*', ''))
			}
			return file.name.toLowerCase().endsWith(type)
		})

		if (!isValidType) {
			throw new Error('File type not supported')
		}

		const formData = new FormData()
		formData.append('file', file)
		for (const [key, value] of Object.entries(options)) {
			formData.append(`option_${key}`, String(value))
		}

		const endpoint = `${neo_api}/upload?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}`

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				body: formData,
				credentials: 'include'
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || `HTTP error! status: ${response.status}`)
			}

			const result = await response.json()
			return result
		} catch (error: any) {
			message.error(error.message || 'Failed to upload file')
			throw error
		}
	})

	/** Handle multiple file uploads **/
	const uploadFiles = useMemoizedFn(async (files: RcFile[]) => {
		try {
			const uploadPromises = files.map((file) => uploadFile(file))
			const results = await Promise.all(uploadPromises)
			return results
		} catch (error) {
			console.error('Failed to upload files:', error)
			throw error
		}
	})

	/** Handle file selection **/
	const handleFileSelect = useMemoizedFn((file: RcFile) => {
		// Validate file type
		const options = {
			process_image: false,
			max_file_size: 10,
			allowed_types: ['image/*', '.pdf', '.doc', '.docx', '.txt'],
			...upload_options
		}

		const isValidType = options.allowed_types.some((type) => {
			if (type.includes('*')) {
				return file.type.startsWith(type.replace('*', ''))
			}
			return file.name.toLowerCase().endsWith(type)
		})

		if (!isValidType) {
			message.error('File type not supported')
			return false
		}

		// Validate file size
		const maxSize = options.max_file_size * 1024 * 1024
		if (file.size > maxSize) {
			message.error(`File size cannot exceed ${options.max_file_size}MB`)
			return false
		}

		setSelectedFiles((prev) => [...prev, { ...file, status: 'uploading' } as UploadFile])
		return false // Prevent automatic upload
	})

	/** Handle file upload **/
	const handleUpload = useMemoizedFn(async () => {
		if (!selectedFiles.length) return

		setUploading(true)
		try {
			const files = selectedFiles.filter((file) => file.status === 'uploading')
			const results = await uploadFiles(files as RcFile[])

			// Update file status to done
			setSelectedFiles((prev) =>
				prev.map((file) => ({
					...file,
					status: 'done',
					response: results.find((r) => r.filename === file.name)
				}))
			)

			message.success('Files uploaded successfully')
		} catch (error: any) {
			// Update file status to error
			setSelectedFiles((prev) =>
				prev.map((file) => ({
					...file,
					status: 'error',
					error: error.message
				}))
			)
		} finally {
			setUploading(false)
		}
	})

	/** Remove file from selection **/
	const handleRemoveFile = useMemoizedFn((file: UploadFile) => {
		setSelectedFiles((prev) => prev.filter((f) => f.uid !== file.uid))
	})

	return {
		messages,
		loading,
		setMessages,
		cancel,
		uploadFile,
		uploadFiles,
		selectedFiles,
		uploading,
		handleFileSelect,
		handleUpload,
		handleRemoveFile
	}
}
