import { useGlobal } from '@/context/app'
import { getToken } from '@/knife'
import { App } from '@/types'
import { useMemoizedFn, useAsyncEffect } from 'ahooks'
import to from 'await-to-js'
import axios from 'axios'
import ntry from 'nice-try'
import { useEffect, useMemo, useRef, useState } from 'react'
import { message as message_ } from 'antd'
import { RcFile } from 'antd/es/upload'
import { getLocale } from '@umijs/max'

type Args = {
	/** the assistant id to use for the chat **/
	assistant_id?: string

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
	'application/json': 'json',
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
	'.yao': 'text/x-yao',
	'.mdx': 'text/markdown',
	'.yml': 'text/x-yaml',
	'.yaml': 'text/x-yaml'
}

// Add these type definitions near the top of the file
type ChatFilter = {
	keywords?: string
	page?: number
	pagesize?: number
	order?: 'desc' | 'asc'
}

export interface ChatItem {
	chat_id: string
	title: string | null
}

export interface ChatGroup {
	label: string
	chats: ChatItem[]
}

export interface ChatResponse {
	groups: ChatGroup[]
	page: number
	pagesize: number
	total: number
	last_page: number
}

// Add these types near the top of the file
type GenerateOptions = {
	useSSE?: boolean // Whether to use Server-Sent Events
	onProgress?: (text: string) => void // Callback for SSE progress updates
	onComplete?: (finalText: string) => void | Promise<void>
}

export default ({ assistant_id, chat_id, upload_options = {} }: Args) => {
	const event_source = useRef<EventSource>()
	const [messages, setMessages] = useState<Array<App.ChatInfo>>([])
	const [title, setTitle] = useState<string>('')
	const [loading, setLoading] = useState(false)
	const [attachments, setAttachments] = useState<App.ChatAttachment[]>([])
	const [pendingCleanup, setPendingCleanup] = useState<App.ChatAttachment[]>([])
	const uploadControllers = useRef<Map<string, AbortController>>(new Map())
	const global = useGlobal()

	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	// Add new state for title generation loading
	const [titleGenerating, setTitleGenerating] = useState(false)

	/** Get Neo API **/
	const neo_api = useMemo(() => {
		const api = global.app_info.optional?.neo?.api
		if (!api) return
		if (api.startsWith('http')) return api
		return `/api/${window.$app.api_prefix}${api}`
	}, [global.app_info.optional?.neo?.api])

	/** Format chat message **/
	const formatMessage = useMemoizedFn(
		(
			role: string,
			content: string,
			chatId: string,
			assistant_id?: string,
			assistant_name?: string,
			assistant_avatar?: string
		) => {
			const baseMessage = {
				is_neo: role === 'assistant',
				context: { chat_id: chatId, assistant_id },
				assistant_name,
				assistant_avatar
			}

			// Check if content is potentially JSON
			const trimmedContent = content.trim()

			// Check if content is potentially JSON Array
			if (trimmedContent.startsWith('[{')) {
				try {
					const parsedContent = JSON.parse(trimmedContent)
					const res: App.ChatInfo[] = []
					parsedContent.forEach((item: any) => {
						res.push({ ...baseMessage, ...item })
					})
					return res
				} catch (e) {
					return [{ ...baseMessage, text: content }]
				}

				// Check if content is potentially JSON Object
			} else if (trimmedContent.startsWith('{')) {
				try {
					const parsedContent = JSON.parse(trimmedContent)
					return [{ ...baseMessage, ...parsedContent }]
				} catch (e) {
					return [{ ...baseMessage, text: content }]
				}
			}

			return [{ ...baseMessage, text: content }]
		}
	)

	/** Get AI Chat History **/
	const getHistory = useMemoizedFn(async () => {
		if (!chat_id) return

		const endpoint = `${neo_api}/history?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}${
			assistant_id ? `&assistant_id=${assistant_id}` : ''
		}`
		const [err, res] = await to<App.ChatHistory>(axios.get(endpoint))
		if (err) return
		if (!res?.data) return

		const formattedMessages: App.ChatInfo[] = []
		res.data.forEach(({ role, content, assistant_id, assistant_name, assistant_avatar }) => {
			formattedMessages.push(
				...formatMessage(role, content, chat_id, assistant_id, assistant_name, assistant_avatar)
			)
		})
		setMessages(formattedMessages)
	})

	/** Handle title generation with progress updates **/
	const handleTitleGeneration = useMemoizedFn(async (messages: App.ChatInfo[], chatId: string) => {
		if (!chatId) return

		setTitleGenerating(true)

		try {
			let generatedTitle = ''

			await generateTitle(JSON.stringify(messages), {
				useSSE: true,
				onProgress: (title) => {
					setTitle(title)
					generatedTitle = title // Keep track of final title
				},
				onComplete: async (finalTitle) => {
					// Use the final complete title
					generatedTitle = finalTitle
					setTitle(finalTitle)

					// Update the chat with the generated title
					try {
						await updateChat(chatId, finalTitle)
					} catch (err) {
						console.error('Failed to update chat title:', err)
						message_.error(is_cn ? '更新标题失败' : 'Failed to update chat title')
					}
				}
			})
		} catch (err) {
			console.error('Failed to generate title:', err)
			message_.error(is_cn ? '生成标题失败' : 'Failed to generate title')
		} finally {
			setTitleGenerating(false)
		}
	})

	/** Get AI Chat Data **/
	const getData = useMemoizedFn(async (message: App.ChatHuman) => {
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
					file_id: attachment.file_id,
					chat_id: attachment.chat_id,
					assistant_id: attachment.assistant_id,
					description: attachment.description || undefined
				})
			})
		}

		// Clean up attachments after preparing content
		const cleanupAttachments = () => {
			setAttachments((prevAttachments) => {
				// Clean up URL objects for non-pinned attachments
				prevAttachments.forEach((attachment) => {
					if (!attachment.pinned && attachment.thumbUrl) {
						URL.revokeObjectURL(attachment.thumbUrl)
					}
				})

				// Keep only pinned attachments
				return prevAttachments.filter((attachment) => attachment.pinned)
			})
			setPendingCleanup([])
		}

		// Clean up attachments after content is prepared
		cleanupAttachments()

		const contentRaw = encodeURIComponent(JSON.stringify(content))
		const contextRaw = encodeURIComponent(JSON.stringify(message.context))
		const token = getToken()
		const assistantParam = assistant_id ? `&assistant_id=${assistant_id}` : ''

		const status_endpoint = `${neo_api}/status?content=${contentRaw}&context=${contextRaw}&token=${token}&chat_id=${chat_id}${assistantParam}`
		const endpoint = `${neo_api}?content=${contentRaw}&context=${contextRaw}&token=${token}&chat_id=${chat_id}${assistantParam}`

		const handleError = async (error: any) => {
			// Check status endpoint for detailed error information
			try {
				const response = await fetch(status_endpoint, {
					credentials: 'include',
					headers: { Accept: 'application/json' }
				})
				if (response.status == 200 || response.status == 201) return

				const data = await response.json().catch(() => ({ message: `HTTP ${response.status}` }))

				let errorMessage = 'Network error, please try again later'
				if (data?.message) {
					errorMessage = data.message
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

				setMessages((prevMessages: Array<App.ChatInfo>) => [
					...prevMessages,
					{
						text: errorMessage,
						type: 'error',
						is_neo: true
					}
				])
			} catch (statusError) {
				// If status check fails, show generic error
				setMessages((prevMessages: Array<App.ChatInfo>) => [
					...prevMessages,
					{
						text: 'Service unavailable, please try again later',
						type: 'error',
						is_neo: true
					}
				])
			}
			setLoading(false)
		}

		function setupEventSource() {
			// Close existing connection if any
			event_source.current?.close()

			const es = new EventSource(endpoint, {
				withCredentials: true
			})
			event_source.current = es

			es.onopen = () => messages.push({ is_neo: true, text: '' })

			es.onmessage = ({ data }: { data: string }) => {
				const formated_data = ntry(() => JSON.parse(data)) as App.ChatAI
				if (!formated_data) return

				// data format handle
				const {
					text,
					props,
					type,
					actions,
					done,
					assistant_id,
					assistant_name,
					assistant_avatar,
					is_new
				} = formated_data
				const current_answer = messages[messages.length - 1] as App.ChatAI

				// Set assistant info
				if (assistant_id) current_answer.assistant_id = assistant_id
				if (assistant_name) current_answer.assistant_name = assistant_name
				if (assistant_avatar) current_answer.assistant_avatar = assistant_avatar
				if (is_new) current_answer.is_new = is_new
				current_answer.type = type || 'text'

				if (done) {
					if (text) {
						current_answer.text = text
					}
					if (type) {
						current_answer.type = type
					}

					if (props) {
						current_answer.props = props
					}

					console.log(`done`, current_answer)

					// If is the first message, generate title using SSE
					if (messages.length === 2 && chat_id && current_answer.text) {
						handleTitleGeneration(messages, chat_id)
					}

					current_answer.actions = actions
					setMessages([...messages])
					setLoading(false)

					es.close()
					return
				}

				if (!text && !props) return
				if (props) {
					current_answer.props = props
				}

				if (text) {
					if (text.startsWith('\r')) {
						current_answer.text = text.replace('\r', '')
					} else {
						current_answer.text = current_answer.text + text
					}
				}

				console.log(current_answer)

				const message_new = [...messages]
				if (message_new.length > 0) {
					message_new[message_new.length - 1] = { ...current_answer }
					setMessages(message_new)
				}
			}

			es.onerror = (ev) => {
				handleError(ev)
				es.close()
			}
		}

		// Directly try to establish EventSource connection
		setupEventSource()
	})

	/** Cancel the AI Chat **/
	const cancel = useMemoizedFn(() => {
		setLoading(false)
		event_source.current?.close()
	})

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
	const uploadFile = useMemoizedFn(async (file: RcFile, handleVision: boolean = true) => {
		const controller = new AbortController()
		uploadControllers.current.set(file.name, controller)

		if (!neo_api) {
			throw new Error('Neo API endpoint not configured')
		}

		// Default options
		const options = {
			process_image: false,
			vision: handleVision,
			max_file_size: 10, // 10MB
			allowed_types: ['image/*', '.pdf', '.doc', '.docx', '.txt'],
			...upload_options
		}

		// Validate file size
		const maxSize = options.max_file_size * 1024 * 1024 // Convert to bytes
		if (file.size > maxSize) {
			throw new Error(`File size cannot exceed ${options.max_file_size}MB`)
		}

		// Update isValidType to use CODE_FILE_TYPES
		const isValidType = (fileType: string, fileName: string) => {
			// Check for code file extensions
			const codeExtensions = Object.keys(CODE_FILE_TYPES)
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

		const endpoint = `${neo_api}/upload?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}${
			assistant_id ? `&assistant_id=${assistant_id}` : ''
		}`

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
				url: result.filename,
				...result,
				content_type: result.content_type || file.type,
				chat_id: chat_id,
				assistant_id: assistant_id
			}
		} catch (error: any) {
			uploadControllers.current.delete(file.name)
			if (error.name === 'AbortError') {
				throw new Error('Upload cancelled')
			}
			message_.error(error.message || 'Failed to upload file')
			throw error
		}
	})

	/** Download file from Neo API **/
	const downloadFile = useMemoizedFn(
		async (file_id: string, disposition: 'inline' | 'attachment' = 'attachment') => {
			if (!neo_api) {
				throw new Error('Neo API endpoint not configured')
			}

			if (!chat_id) {
				throw new Error('Chat ID is required')
			}

			const endpoint = `${neo_api}/download?file_id=${encodeURIComponent(
				file_id
			)}&token=${encodeURIComponent(getToken())}&chat_id=${chat_id}&disposition=${disposition}${
				assistant_id ? `&assistant_id=${assistant_id}` : ''
			}`

			try {
				const response = await fetch(endpoint, {
					credentials: 'include'
				})

				if (!response.ok) {
					const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }))
					throw new Error(error.message || `Failed to download file: ${response.statusText}`)
				}

				// Get filename from Content-Disposition header if present
				const contentDisposition = response.headers.get('Content-Disposition')
				const filename = contentDisposition
					? contentDisposition.split('filename=')[1]?.replace(/["']/g, '')
					: file_id

				// Create blob from response
				const blob = await response.blob()

				// Create download link and trigger download
				const url = window.URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = url
				link.download = filename
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				window.URL.revokeObjectURL(url)

				return { success: true }
			} catch (error: any) {
				message_.error(error.message || 'Failed to download file')
				throw error
			}
		}
	)

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

	/** Get All Chats **/
	const getChats = useMemoizedFn(async (filter?: ChatFilter) => {
		if (!neo_api) return { groups: [], page: 1, pagesize: 10, total: 0, last_page: 1 }

		const params = new URLSearchParams()
		params.append('token', getToken())

		// Add filter parameters if provided
		if (filter) {
			if (filter.keywords) params.append('keywords', filter.keywords)
			if (filter.page) params.append('page', filter.page.toString())
			if (filter.pagesize) params.append('pagesize', filter.pagesize.toString())
			if (filter.order) params.append('order', filter.order)
		}

		const endpoint = `${neo_api}/chats?${params.toString()}`
		const [err, res] = await to<{ data: ChatResponse }>(axios.get(endpoint))
		if (err) throw err

		// Return the complete response data with pagination info
		return {
			groups: res?.data?.groups || [],
			page: res?.data?.page || 1,
			pagesize: res?.data?.pagesize || 10,
			total: res?.data?.total || 0,
			last_page: res?.data?.last_page || 1
		}
	})

	/** Get Single Chat **/
	const getChat = useMemoizedFn(async (id?: string) => {
		if (!neo_api) return

		const chatId = id || chat_id
		if (!chatId) return null

		const endpoint = `${neo_api}/chats/${chatId}?token=${encodeURIComponent(getToken())}`

		const [err, res] = await to<{ data: App.ChatDetail }>(axios.get(endpoint))
		if (err) {
			message_.error('Failed to fetch chat details')
			return
		}

		if (!res?.data) return null

		const chatInfo = res.data
		const formattedMessages: App.ChatInfo[] = []
		chatInfo.history.forEach(({ role, content, assistant_id, assistant_name, assistant_avatar }) => {
			formattedMessages.push(
				...formatMessage(role, content, chat_id || '', assistant_id, assistant_name, assistant_avatar)
			)
		})

		// Set messages directly in getChat
		setMessages(formattedMessages)
		setTitle(chatInfo.chat.title || (is_cn ? '未命名' : 'Untitled'))

		return {
			messages: formattedMessages,
			title: chatInfo.chat.title || (is_cn ? '未命名' : 'Untitled')
		}
	})

	/** Update Chat **/
	const updateChatByContent = useMemoizedFn(async (id: string, content: string) => {
		if (!neo_api) return

		const endpoint = `${neo_api}/chats/${id}?token=${encodeURIComponent(getToken())}`

		const [err, res] = await to<{ title?: string; message?: string; code?: number }>(
			axios.post(endpoint, { content })
		)
		if (err) {
			message_.error('Failed to update chat')
			return false
		}

		const { title, message: msg, code } = res || {}
		if (code && code >= 400) {
			message_.error(msg || 'Failed to update chat')
			return false
		}

		setTitle(title || '')
		return true
	})

	/** Update Chat **/
	const updateChat = useMemoizedFn(async (chatId: string, title: string) => {
		if (!neo_api) return false
		const endpoint = `${neo_api}/chats/${chatId}?token=${encodeURIComponent(getToken())}`
		const [err] = await to(axios.post(endpoint, { title }))
		if (err) throw err
		return true
	})

	/** Delete Chat **/
	const deleteChat = useMemoizedFn(async (chatId: string) => {
		if (!neo_api) return false
		const endpoint = `${neo_api}/chats/${chatId}?token=${encodeURIComponent(getToken())}`
		const [err] = await to(axios.delete(endpoint))
		if (err) throw err
		return true
	})

	/** Delete All Chats **/
	const deleteAllChats = useMemoizedFn(async () => {
		if (!neo_api) return false
		const endpoint = `${neo_api}/dangerous/clear_chats?token=${encodeURIComponent(getToken())}`
		const [err] = await to(axios.delete(endpoint))
		if (err) throw err
		return true
	})

	/** Get Mentions **/
	const getMentions = useMemoizedFn(async (keywords: string) => {
		if (!neo_api) return []

		const params = new URLSearchParams()
		params.append('token', getToken())
		if (keywords) {
			params.append('keywords', keywords)
		}

		const endpoint = `${neo_api}/mentions?${params.toString()}`
		const [err, res] = await to<{ data: App.Mention[] }>(axios.get(endpoint))
		if (err) throw err

		return res?.data || []
	})

	/** Generate with AI **/
	const generate = useMemoizedFn(
		async (content: string, type: string, systemPrompt: string, options: GenerateOptions = {}) => {
			if (!neo_api) return ''

			const endpoint = `${neo_api}/generate?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}${
				assistant_id ? `&assistant_id=${assistant_id}` : ''
			}`

			if (options.useSSE) {
				return new Promise<string>((resolve, reject) => {
					const es = new EventSource(endpoint, { withCredentials: true })
					let result = ''

					es.onmessage = ({ data }) => {
						const response = ntry(() => JSON.parse(data))
						if (!response) return

						// Handle error response
						if (response.type === 'error') {
							es.close()
							reject(new Error(response.text))
							return
						}

						const { text, done } = response
						if (text) {
							result += text
							options.onProgress?.(result)
						}
						if (done) {
							es.close()
							options.onComplete?.(result)
							resolve(result)
						}
					}

					es.onerror = (err) => {
						es.close()
						reject(err)
					}
				})
			}

			// Regular HTTP request
			const [err, res] = await to(axios.post(endpoint, { content, type, system_prompt: systemPrompt }))
			if (err) throw err
			return res?.data?.result || ''
		}
	)

	/** Generate title **/
	const generateTitle = useMemoizedFn(async (content: string, options: GenerateOptions = {}) => {
		if (!neo_api) return ''

		const endpoint = `${neo_api}/generate/title?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}${
			assistant_id ? `&assistant_id=${assistant_id}` : ''
		}&content=${encodeURIComponent(content)}`

		if (options.useSSE) {
			return new Promise<string>((resolve, reject) => {
				const es = new EventSource(endpoint, { withCredentials: true })
				let result = ''

				es.onmessage = ({ data }) => {
					const response = ntry(() => JSON.parse(data))
					if (!response) return

					// Handle error response
					if (response.type === 'error') {
						es.close()
						reject(new Error(response.text))
						return
					}

					const { text, done } = response
					if (text) {
						result += text
						options.onProgress?.(result)
					}
					if (done) {
						es.close()
						options.onComplete?.(result)
						resolve(result)
					}
				}

				es.onerror = (err) => {
					es.close()
					reject(err)
				}
			})
		}

		// Regular HTTP request
		const [err, res] = await to(axios.post(endpoint, { content }))
		if (err) throw err
		return res?.data?.result || ''
	})

	/** Generate prompts **/
	const generatePrompts = useMemoizedFn(async (content: string, options: GenerateOptions = {}) => {
		if (!neo_api) return ''

		const endpoint = `${neo_api}/generate/prompts?token=${encodeURIComponent(getToken())}&chat_id=${chat_id}${
			assistant_id ? `&assistant_id=${assistant_id}` : ''
		}&content=${encodeURIComponent(content)}`

		if (options.useSSE) {
			return new Promise<string>((resolve, reject) => {
				const es = new EventSource(endpoint, { withCredentials: true })
				let result = ''

				es.onmessage = ({ data }) => {
					const response = ntry(() => JSON.parse(data))
					if (!response) return

					// Handle error response
					if (response.type === 'error') {
						es.close()
						reject(new Error(response.text))
						return
					}

					const { text, done } = response
					if (text) {
						result += text
						options.onProgress?.(result)
					}
					if (done) {
						es.close()
						resolve(result)
					}
				}

				es.onerror = (err) => {
					es.close()
					reject(err)
				}
			})
		}

		// Regular HTTP request
		const [err, res] = await to(axios.post(endpoint, { content }))
		if (err) throw err
		return res?.data?.result || ''
	})

	/** Get Assistant List */
	const getAssistants = useMemoizedFn(async (filter?: App.AssistantFilter) => {
		if (!neo_api) return { data: [], page: 1, pagesize: 10, total: 0, last_page: 1 }

		const params = new URLSearchParams()
		params.append('token', getToken())

		// Add filter parameters if provided
		if (filter) {
			if (filter.keywords) params.append('keywords', filter.keywords)
			if (filter.page) params.append('page', filter.page.toString())
			if (filter.pagesize) params.append('pagesize', filter.pagesize.toString())
			if (filter.tags) params.append('tags', filter.tags.join(','))
			if (filter.connector) params.append('connector', filter.connector)
			if (filter.select) params.append('select', filter.select.join(','))
			if (filter.mentionable !== undefined) params.append('mentionable', filter.mentionable.toString())
			if (filter.automated !== undefined) params.append('automated', filter.automated.toString())
		}

		const endpoint = `${neo_api}/assistants?${params.toString()}`
		const [err, res] = await to<{ data: App.AssistantResponse }>(axios.get(endpoint))
		if (err) throw err

		return res?.data || { data: [], page: 1, pagesize: 10, total: 0, last_page: 1 }
	})

	/** Find Assistant Detail */
	const findAssistant = useMemoizedFn(async (assistantId: string) => {
		if (!neo_api) return null

		const endpoint = `${neo_api}/assistants/${assistantId}?token=${encodeURIComponent(getToken())}`
		const [err, res] = await to<{ data: App.Assistant }>(axios.get(endpoint))
		if (err) throw err

		return res?.data || null
	})

	/** Save Assistant */
	const saveAssistant = useMemoizedFn(async (assistant: Partial<App.Assistant>) => {
		if (!neo_api) return null

		const endpoint = `${neo_api}/assistants?token=${encodeURIComponent(getToken())}`
		const [err, res] = await to<{ data: App.Assistant }>(axios.post(endpoint, assistant))
		if (err) throw err

		return res?.data || null
	})

	/** Delete Assistant */
	const deleteAssistant = useMemoizedFn(async (assistantId: string) => {
		if (!neo_api) return false

		const endpoint = `${neo_api}/assistants/${assistantId}?token=${encodeURIComponent(getToken())}`
		const [err] = await to(axios.delete(endpoint))
		if (err) throw err

		return true
	})

	return {
		messages,
		loading,
		setMessages,
		cancel,
		uploadFile,
		downloadFile,
		attachments,
		setAttachments,
		addAttachment,
		removeAttachment,
		clearAttachments,
		cancelUpload,
		formatFileName,
		getHistory,
		getChats,
		getChat,
		updateChat,
		title,
		setTitle,
		deleteChat,
		deleteAllChats,
		getMentions,
		generate,
		generateTitle,
		generatePrompts,
		titleGenerating,
		setTitleGenerating,
		getAssistants,
		findAssistant,
		saveAssistant,
		deleteAssistant,
		setPendingCleanup
	}
}
