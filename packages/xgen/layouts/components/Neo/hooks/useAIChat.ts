import { useGlobal } from '@/context/app'
import { getToken } from '@/knife'
import { App } from '@/types'
import { useMemoizedFn, useAsyncEffect } from 'ahooks'
import to from 'await-to-js'
import axios from 'axios'
import ntry from 'nice-try'
import { useEffect, useMemo, useRef, useState } from 'react'
import { message } from 'antd'
import { RcFile } from 'antd/es/upload'

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

export const formatFileName = (fileName: string, maxLength: number = 30) => {
	if (fileName.length <= maxLength) return fileName

	const ext = fileName.split('.').pop() || ''
	const nameWithoutExt = fileName.slice(0, fileName.lastIndexOf('.'))
	const start = nameWithoutExt.slice(0, 10)
	const end = nameWithoutExt.slice(-10)

	return `${start}...${end}.${ext}`
}

// Update allowed file types - only keep specific document types
const ALLOWED_FILE_TYPES = {
	'application/pdf': 'pdf',
	'application/msword': 'doc',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
	'application/vnd.oasis.opendocument.text': 'odt',
	'application/vnd.ms-excel': 'xls',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
	'application/vnd.ms-powerpoint': 'ppt',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
} as const

// Keep CODE_FILE_TYPES for handling specific code file extensions
const CODE_FILE_TYPES: Record<string, string> = {
	'.js': 'text/javascript',
	'.ts': 'text/typescript',
	'.go': 'text/x-go',
	'.py': 'text/x-python',
	'.java': 'text/x-java',
	'.c': 'text/x-c',
	'.cpp': 'text/x-c++',
	'.rb': 'text/x-ruby',
	'.php': 'text/x-php',
	'.swift': 'text/x-swift',
	'.rs': 'text/x-rust',
	'.jsx': 'text/javascript',
	'.tsx': 'text/typescript',
	'.vue': 'text/x-vue',
	'.sh': 'text/x-sh',
	'.yao': 'text/x-yao'
}

export default ({ chat_id, upload_options = {} }: Args) => {
	const event_source = useRef<EventSource>()
	const [messages, setMessages] = useState<Array<App.ChatInfo>>([])
	const [loading, setLoading] = useState(false)
	const [attachments, setAttachments] = useState<App.ChatAttachment[]>([])
	const uploadControllers = useRef<Map<string, AbortController>>(new Map())
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

		const content: { text: string; attachments?: App.ChatAttachment[] } = { text: message.text }

		// Set attachments
		if (attachments?.length && attachments.length > 0) {
			content.attachments = []
			attachments.forEach((attachment) => {
				content.attachments?.push({
					name: attachment.name,
					url: attachment.url,
					type: attachment.type,
					content_type: attachment.content_type,
					bytes: attachment.bytes,
					created_at: attachment.created_at,
					filename: attachment.filename,
					file_id: attachment.file_id
				})
			})
		}

		const contentRaw = encodeURIComponent(JSON.stringify(content))
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

				// Clear attachments after successful request
				attachments.forEach((attachment) => {
					if (attachment.thumbUrl) {
						URL.revokeObjectURL(attachment.thumbUrl)
					}
				})
				setAttachments([])
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

				const { text, type, actions, done } = formated_data
				const current_answer = messages[messages.length - 1] as App.ChatAI
				if (done) {
					if (text) {
						current_answer.text = text
					}
					if (type) {
						current_answer.type = type
					}
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
		const controller = new AbortController()
		uploadControllers.current.set(file.name, controller)

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

		// Update isValidType to include .yao in code extensions
		const isValidType = (fileType: string, fileName: string) => {
			// Check for code file extensions
			const codeExtensions = [
				'.js',
				'.ts',
				'.go',
				'.py',
				'.java',
				'.c',
				'.cpp',
				'.rb',
				'.php',
				'.swift',
				'.rs',
				'.jsx',
				'.tsx',
				'.vue',
				'.sh',
				'.yao'
			]
			if (codeExtensions.some((ext) => fileName.toLowerCase().endsWith(ext))) {
				return true
			}

			// Check for general media types
			if (
				fileType.startsWith('text/') ||
				fileType.startsWith('image/') ||
				fileType.startsWith('audio/') ||
				fileType.startsWith('video/')
			) {
				return true
			}

			// Check for specific document types
			return fileType in ALLOWED_FILE_TYPES
		}

		if (!isValidType(file.type, file.name)) {
			throw new Error('File type not supported')
		}

		const formData = new FormData()

		// Handle code files with correct Content-Type
		const ext = '.' + file.name.split('.').pop()?.toLowerCase()
		if (ext && CODE_FILE_TYPES[ext]) {
			const codeBlob = new Blob([file], { type: CODE_FILE_TYPES[ext] })
			formData.append('file', codeBlob, file.name)
		} else {
			formData.append('file', file)
		}

		for (const [key, value] of Object.entries(options)) {
			formData.append(`option_${key}`, String(value))
		}

		const endpoint = `${neo_api}/upload?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}`

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				body: formData,
				credentials: 'include',
				signal: controller.signal
			})

			uploadControllers.current.delete(file.name)

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || `HTTP error! status: ${response.status}`)
			}

			const result = await response.json()
			return {
				...result,
				url: result.filename,
				content_type: result.content_type || file.type
			}
		} catch (error: any) {
			uploadControllers.current.delete(file.name)
			if (error.name === 'AbortError') {
				throw new Error('Upload cancelled')
			}
			message.error(error.message || 'Failed to upload file')
			throw error
		}
	})

	/** Add/Update attachment **/
	const addAttachment = useMemoizedFn((attachment: App.ChatAttachment) => {
		setAttachments((prev) => [...prev, attachment])
	})

	/** Remove attachment **/
	const removeAttachment = useMemoizedFn((attachmentToRemove: App.ChatAttachment) => {
		if (attachmentToRemove.status === 'uploading') {
			cancelUpload(attachmentToRemove.name)
		}
		setAttachments((prev) => prev.filter((attachment) => attachment.name !== attachmentToRemove.name))
	})

	/** Clear all attachments **/
	const clearAttachments = useMemoizedFn(() => {
		setAttachments([])
	})

	/** Cancel upload **/
	const cancelUpload = useMemoizedFn((fileName: string) => {
		const controller = uploadControllers.current.get(fileName)
		if (controller) {
			controller.abort()
			uploadControllers.current.delete(fileName)
		}
	})

	return {
		messages,
		loading,
		setMessages,
		cancel,
		uploadFile,
		attachments,
		addAttachment,
		removeAttachment,
		clearAttachments,
		cancelUpload,
		formatFileName
	}
}
