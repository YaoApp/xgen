import { useGlobal } from '@/context/app'
import { useMemoizedFn } from 'ahooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAction } from '@/actions'
import { getLocale } from '@umijs/max'
import ntry from 'nice-try'
import { getToken } from '@/knife'
import { App } from '@/types'

// 导入 AIChat 目录中的所有模块
import { AIHookArgs } from './AIChat/types'
import { fixMessageDone, formatMessage, processAIChatData } from './AIChat/messageHandling'
import { createFileHandlers } from './AIChat/fileHandling'
import { createChatManagement } from './AIChat/chatManagement'
import { createAssistantManagement } from './AIChat/assistantManagement'
import { createTitleGenerationHandlers } from './AIChat/titleGeneration'
import { formatFileName } from './AIChat/utils'

export default ({ chat_id, upload_options = {} }: AIHookArgs) => {
	const event_source = useRef<EventSource>()
	const global = useGlobal()
	const [messages, setMessages] = useState<Array<App.ChatInfo>>([])
	const [assistant, setAssistant] = useState<App.AssistantSummary | undefined>(global.default_assistant)

	const [title, setTitle] = useState<string>('')
	const [loading, setLoading] = useState(false)
	const [loadingChat, setLoadingChat] = useState(false)
	const [attachments, setAttachments] = useState<App.ChatAttachment[]>([])
	const [pendingCleanup, setPendingCleanup] = useState<App.ChatAttachment[]>([])
	const uploadControllers = useRef<Map<string, AbortController>>(new Map())
	const [assistant_id, setAssistantId] = useState<string | undefined>('')

	const locale = getLocale()
	const is_cn = locale === 'zh-CN'
	const onAction = useAction()

	// Add new state for title generation loading
	const [titleGenerating, setTitleGenerating] = useState(false)

	/** Get Neo API **/
	const neo_api = useMemo(() => {
		const api = global.app_info.optional?.neo?.api
		if (!api) return
		if (api.startsWith('http')) return api
		return `/api/${window.$app.api_prefix}${api}`
	}, [global.app_info.optional?.neo?.api])

	// Create file handlers
	const { uploadFile, downloadFile, cancelUpload } = createFileHandlers(
		neo_api,
		chat_id,
		assistant_id,
		uploadControllers,
		upload_options
	)

	// Create assistant management
	const {
		updateAssistant,
		resetAssistant,
		getAssistants,
		getAssistantTags,
		callAssistantAPI,
		findAssistant,
		saveAssistant,
		deleteAssistant
	} = createAssistantManagement(neo_api, chat_id, setAssistant, setAssistantId, global.default_assistant)

	// Create chat management
	const {
		getHistory,
		getChats,
		getChat,
		getLatestChat,
		updateChat,
		updateChatByContent,
		deleteChat,
		deleteAllChats,
		getMentions,
		makeChatID
	} = createChatManagement(
		neo_api,
		chat_id,
		assistant_id,
		setMessages,
		setTitle,
		setLoading,
		setLoadingChat,
		updateAssistant,
		global.setNeoChatId,
		formatMessage
	)

	// Create title generation handlers
	const { handleTitleGeneration, generateTitle, generatePrompts, generate } = createTitleGenerationHandlers(
		neo_api,
		chat_id,
		assistant_id,
		setTitle,
		setTitleGenerating,
		updateChat
	)

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

				// Check previous messages if is neo not mark as done, when done == true break
				fixMessageDone(messages, 'error')
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
			// Save last assistant info
			const last_assistant: {
				assistant_id: string | null
				assistant_name: string | null
				assistant_avatar: string | null
			} = { assistant_id: null, assistant_name: null, assistant_avatar: null }

			let last_type: App.ChatMessageType | null = null
			let content = ''

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

				content = processAIChatData({
					formated_data,
					content,
					messages,
					last_assistant,
					updateAssistant,
					setMessages,
					setLoading,
					eventSource: es,
					handleTitleGeneration,
					chat_id,
					defaultAssistantId: global.default_assistant.assistant_id,
					onAction
				})
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

		// Fix the done message
		const fixed = fixMessageDone(messages, 'cancelled')
		if (fixed) {
			setMessages([...messages])
		}
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

	return {
		messages,
		loading,
		loadingChat,
		assistant,
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
		makeChatID,
		getChats,
		getChat,
		getLatestChat,
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
		resetAssistant,
		updateAssistant,
		setTitleGenerating,
		getAssistants,
		getAssistantTags,
		findAssistant,
		saveAssistant,
		deleteAssistant,
		callAssistantAPI,
		setPendingCleanup
	}
}
