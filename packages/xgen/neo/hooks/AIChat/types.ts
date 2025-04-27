import { App } from '@/types'
import { RcFile } from 'antd/es/upload'
import type { Action } from '@/types'

export type AIHookArgs = {
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

export type ChatFilter = {
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

export type GenerateOptions = {
	useSSE?: boolean // Whether to use Server-Sent Events
	onProgress?: (text: string) => void // Callback for SSE progress updates
	onComplete?: (finalText: string) => void | Promise<void>
}

/**
 * Merge props parameters
 */
export type MergePropsParams = {
	type?: App.ChatMessageType
	delta?: boolean
	begin?: number
	end?: number
}

/**
 * Message log
 */
export type MessageLog = {
	title: string
	text: string
	begin?: number
	end?: number
	status?: string
	task_id?: string
}

/**
 * Interface for parameters needed to process AI chat data
 */
export interface ProcessAIChatDataParams {
	// Raw data and content
	/** Raw data string from event source */
	// data: string

	/** Formated data object */
	formated_data: App.ChatAI

	/** Current accumulated content */
	content: string

	// Messages and assistant information
	/** Array of chat messages */
	messages: Array<App.ChatInfo>
	/** Object to track assistant information */
	last_assistant: {
		assistant_id: string | null
		assistant_name: string | null
		assistant_avatar: string | null
	}

	// State update functions
	/** Function to update assistant information */
	updateAssistant: (assistant: App.AssistantSummary) => void
	/** Function to update messages state */
	setMessages: (messages: Array<App.ChatInfo>) => void
	/** Function to update loading state */
	setLoading: (loading: boolean) => void

	// Event source and handlers
	/** EventSource instance for SSE connection */
	eventSource: EventSource
	/** Function to handle title generation */
	handleTitleGeneration: (messages: Array<App.ChatInfo>, chat_id: string) => void

	// Configuration
	/** Current chat ID */
	chat_id: string | undefined
	/** Default assistant ID */
	defaultAssistantId: string | undefined

	// Action handling
	/** Action dispatcher function */
	onAction: (params: {
		namespace: string
		primary: string
		data_item: any
		it: { action: Array<Action.ActionParams>; title: string; icon: string }
		extra?: any
	}) => void
}
