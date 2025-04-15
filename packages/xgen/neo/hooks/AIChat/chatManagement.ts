import { getToken } from '@/knife'
import { message as message_ } from 'antd'
import axios from 'axios'
import to from 'await-to-js'
import { getLocale } from '@umijs/max'
import { App } from '@/types'
import { ChatFilter, ChatResponse } from './types'

export const createChatManagement = (
	neo_api: string | undefined,
	chat_id: string | undefined,
	assistant_id: string | undefined,
	setMessages: React.Dispatch<React.SetStateAction<Array<App.ChatInfo>>>,
	setTitle: React.Dispatch<React.SetStateAction<string>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	setLoadingChat: React.Dispatch<React.SetStateAction<boolean>>,
	updateAssistant: (assistant: App.AssistantSummary) => Promise<void>,
	setNeoChatId: (id: string) => void,
	formatMessage: (
		role: string,
		content: string,
		chatId: string,
		assistant_id?: string,
		assistant_name?: string,
		assistant_avatar?: string
	) => App.ChatInfo[]
) => {
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	/** Get AI Chat History **/
	const getHistory = async () => {
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
	}

	/** Get All Chats **/
	const getChats = async (filter?: ChatFilter) => {
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

		setLoading(true)
		const endpoint = `${neo_api}/chats?${params.toString()}`
		const [err, res] = await to<{ data: ChatResponse }>(axios.get(endpoint))
		if (err) {
			setLoading(false)
			throw err
		}

		// Return the complete response data with pagination info
		setLoading(false)
		return {
			groups: res?.data?.groups || [],
			page: res?.data?.page || 1,
			pagesize: res?.data?.pagesize || 10,
			total: res?.data?.total || 0,
			last_page: res?.data?.last_page || 1
		}
	}

	/** Get Single Chat **/
	const getChat = async (id?: string) => {
		setLoadingChat(true)
		if (!neo_api) return

		const chatId = id || chat_id
		if (!chatId) return null

		const endpoint = `${neo_api}/chats/${chatId}?token=${encodeURIComponent(getToken())}`

		const [err, res] = await to<{ data: App.ChatDetail }>(axios.get(endpoint))
		if (err) {
			message_.error('Failed to fetch chat details')
			setLoadingChat(false)
			return
		}

		if (!res?.data) {
			setLoadingChat(false)
			return null
		}

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

		// Update assistant
		updateAssistant(res.data.chat as App.AssistantSummary)
		setLoadingChat(false)

		return {
			messages: formattedMessages,
			title: chatInfo.chat.title || (is_cn ? '未命名' : 'Untitled')
		}
	}

	/** Get the latest chat ID */
	const getLatestChat = async function (
		assistant_id?: string
	): Promise<{ chat_id: string; placeholder?: App.ChatPlaceholder; exist?: boolean } | null> {
		if (!neo_api) return { chat_id: makeChatID(), placeholder: undefined, exist: false }
		setLoadingChat(true)

		const endpoint = `${neo_api}/chats/latest?token=${encodeURIComponent(getToken())}&assistant_id=${
			assistant_id || ''
		}`

		const [err, res] = await to<{ data: App.ChatDetail | { placeholder: App.ChatPlaceholder } }>(
			axios.get(endpoint)
		)
		if (err) {
			message_.error('Failed to fetch the latest chat')
			setLoadingChat(false)
			return null
		}

		if (!res?.data) return null

		// New chat
		if (typeof res.data === 'object' && 'placeholder' in res.data) {
			// Update assistant
			updateAssistant(res.data as App.AssistantSummary)
			setLoadingChat(false)
			return { chat_id: makeChatID(), placeholder: res.data.placeholder }
		}

		// Existing chat
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

		// Update assistant
		updateAssistant(chatInfo.chat)
		setLoadingChat(false)

		// Set chat_id
		setNeoChatId(chatInfo.chat.chat_id)
		return { chat_id: chatInfo.chat.chat_id, exist: true }
	}

	/** Update Chat **/
	const updateChatByContent = async (id: string, content: string) => {
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
	}

	/** Update Chat **/
	const updateChat = async (chatId: string, title: string) => {
		if (!neo_api) return false
		const endpoint = `${neo_api}/chats/${chatId}?token=${encodeURIComponent(getToken())}`
		const [err] = await to(axios.post(endpoint, { title }))
		if (err) throw err
		return true
	}

	/** Delete Chat **/
	const deleteChat = async (chatId: string) => {
		if (!neo_api) return false
		const endpoint = `${neo_api}/chats/${chatId}?token=${encodeURIComponent(getToken())}`
		const [err] = await to(axios.delete(endpoint))
		if (err) throw err
		return true
	}

	/** Delete All Chats **/
	const deleteAllChats = async () => {
		if (!neo_api) return false
		const endpoint = `${neo_api}/dangerous/clear_chats?token=${encodeURIComponent(getToken())}`
		const [err] = await to(axios.delete(endpoint))
		if (err) throw err
		return true
	}

	/** Get Mentions **/
	const getMentions = async (keywords: string) => {
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
	}

	/** Make a chat ID */
	const makeChatID = function () {
		const random = Math.random().toString(36).substring(2, 15)
		const ts = Date.now()
		return `chat_${ts}_${random}`
	}

	return {
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
	}
}
