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
