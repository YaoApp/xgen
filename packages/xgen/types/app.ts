import type { Action, Common } from '@/types'

export declare namespace App {
	/**
	 * Layout type 布局类型
	 * - Chat: AI Chat Interface (AI 对话界面)
	 *   Button text: "Chat" / "对话"
	 * - Admin: Admin Dashboard (管理后台)
	 *   Button text: "Admin" / "后台"
	 */
	type Layout = 'Chat' | 'Admin'

	type Theme = 'light' | 'dark'

	/** Global Neo Context */
	type Neo = { assistant_id?: string; chat_id?: string; placeholder?: ChatPlaceholder }

	type ChatMessageType =
		| 'text'
		| 'image'
		| 'audio'
		| 'video'
		| 'file'
		| 'link'
		| 'error'
		| 'progress'
		| 'page'
		| 'widget'
		| 'tool'
		| 'think'
		| 'loading'
		| 'action'

	type ChatCmd = {
		id: string
		name: string
		request: string
	}

	type ChatCommand = {
		use: string
		name: string
		description: string
	}

	/** Assistant related types */
	interface Assistant {
		assistant_id: string
		name: string
		type: string
		tags?: string[]
		built_in?: boolean
		readonly?: boolean
		mentionable?: boolean
		automated?: boolean
		avatar?: string
		connector?: string
		[key: string]: any
	}

	interface AssistantSummary {
		assistant_id?: string
		assistant_name?: string
		assistant_avatar?: string
		assistant_deleteable?: boolean
		placeholder?: ChatPlaceholder
	}

	interface Connectors {
		options: Array<{ label: string; value: string }>
		mapping: Record<string, string>
	}

	interface AssistantFilter {
		keywords?: string
		tags?: string[]
		connector?: string
		select?: string[]
		mentionable?: boolean
		automated?: boolean
		page?: number
		pagesize?: number
	}

	interface AssistantResponse {
		data: Assistant[]
		page: number
		pagesize: number
		total: number
		last_page: number
		pagecnt?: number
		next?: number
		prev?: number
	}

	type ChatAI = {
		is_neo: boolean
		new: boolean
		text: string
		id?: string
		type?: ChatMessageType
		function?: string
		arguments?: string
		props?: Record<string, any>
		assistant_id?: string
		assistant_name?: string
		assistant_avatar?: string
		// actions?: Array<Action.ActionParams>
		done: boolean // Whether the message is done
		delta?: boolean // Whether the message is a delta message
	}

	type ChatHuman = {
		is_neo: boolean
		text: string
		attachments?: ChatAttachment[]
		assistant_id?: string
		context?: {
			namespace: string
			stack: string
			pathname: string
			formdata: any
			field?: Omit<Field, 'config'>
			config?: Common.FieldDetail
			signal?: ChatContext['signal']
			chat_id?: string
			assistant_id?: string
		}
	}

	type ChatInfo = ChatHuman | ChatAI

	/** Chat detail with history */
	interface ChatDetail {
		chat: {
			assistant_id?: string
			assistant_name?: string
			assistant_avatar?: string
			assistant_deleteable?: boolean
			placeholder?: ChatPlaceholder

			[key: string]: any
		}
		history: Array<{
			role: string
			content: string
			assistant_id?: string
			assistant_name?: string
			assistant_avatar?: string
			[key: string]: any
		}>
	}

	type ChatHistory = {
		command?: ChatCmd
		data: Array<{
			content: string
			role: 'user' | 'assistant' | 'system'
			assistant_id?: string
			assistant_name?: string
			assistant_avatar?: string
		}>
	}

	interface ChatContext {
		placeholder: string
		signal: any
	}

	interface Context {
		namespace: string
		primary: string
		data_item: any
	}

	interface Field {
		name: string
		bind: string
		config: Common.FieldDetail
	}

	type Role = {
		captcha: string
		login: string
		/** Configure login page brand and cover */
		layout?: {
			/** login page cover image */
			cover?: string
			/** default is 'Make Your Dream With Yao App Engine' */
			slogan?: string
			/** default is yaoapps.com */
			site?: string
		}
		thirdPartyLogin?: Array<{
			/** button text */
			title: string
			/** third party login href text */
			href: string
			/** button prefix icon */
			icon?: string
			/** set whether the target of the a tag is _blank */
			blank?: boolean
		}>
	}

	interface Info {
		/** Application Name */
		name: string

		/** Application version */
		version?: string

		/** Application description */
		description?: string
		/** api prefix, default is __yao */
		apiPrefix?: string
		/** brand logo, default is YAO */
		logo?: string
		/** favicon, default is YAO */
		favicon?: string
		/** login config */
		login: {
			/** Configure admin login setting */
			admin: Role
			/** Configure user login setting */
			user?: Role
			/** Configure the jump page after administrator and user login */
			entry: {
				admin: string
				user: string
			}
		}
		/** define token behavior, default is sessionStorage */
		token?: {
			/** way of token storage */
			storage: 'sessionStorage' | 'localStorage'
		}

		/** Application mode */
		mode?: 'development' | 'production' | 'test'

		/** default assistant */
		agent?: {
			default?: AssistantSummary
			connectors?: Array<{ label: string; value: string }>
		}

		optional?: {
			/** default layout */
			layout?: Layout

			/** remote api cache, default is true */
			remoteCache?: boolean
			/** neo config, for chatgpt service */
			neo?: {
				/** Neo stream API endpoint */
				api: string

				/**
				 * Dock position
				 * Options:
				 * - `right-bottom`: Floats at the bottom-right corner.（default）
				 * - `right-top`: Sticks to the top-right corner, clicking the button opens the chat window on the right side.
				 * - `right`: Docked to the right side.
				 */
				dock?: 'right-bottom' | 'right-top' | 'right'

				studio?: boolean // Will be deprecated

				// AI Chatbot Name
				name?: string
			}

			/** menu config, default is { layout:"2-columns", hide:false, showName:false }  */
			menu?: { layout: '1-column' | '2-columns'; hide?: boolean; showName?: boolean }

			/**
			 * Developer-specific controls.
			 */
			devControls?: {
				/**
				 * Determines whether to show xterm links.
				 * Default: `false`. Takes effect only in development mode.
				 */
				enableXterm?: boolean

				/**
				 * Enables the "Edit with AI" button.
				 * Default: `false`. Takes effect only in development mode.
				 */
				enableAIEdit?: boolean

				/**
				 * ?? Planning, not implemented yet
				 * Enables the "View Source Code" button.
				 * Default: `false`. Takes effect only in development mode.
				 */
				enableViewSourceCode?: boolean
			}
		}
	}

	interface User {
		email: string
		id: number
		mobile?: any
		name: string
		type: string
	}

	interface Menu {
		id: number
		key: string
		name: string
		icon?: string | { name: string; size: number }
		path: string
		badge?: number
		dot?: boolean
		children?: Array<Menu>
	}

	interface Menus {
		items: Array<App.Menu> // Main menu
		setting: Array<App.Menu> // Setting menu
		quick: Array<App.Menu> // Quick menu
	}

	interface ChatAttachment {
		name: string
		type: string
		url?: string
		status?: 'uploading' | 'done' | 'error'
		file_id?: string
		bytes?: number
		created_at?: number
		filename?: string
		content_type?: string
		chat_id?: string
		assistant_id?: string
		thumbUrl?: string
		blob?: Blob
		pinned?: boolean
		description?: string
	}

	/** Options for creating a new chat */
	interface NewChatOptions {
		content?: string
		chat_id?: string
		assistant?: AssistantSummary
		attachments?: ChatAttachment[]
		placeholder?: ChatPlaceholder
	}

	interface ChatPlaceholder {
		title?: string
		description?: string
		prompts?: string[]
	}

	// Add Mention interface near the top with other basic types
	interface Mention {
		id: string
		name: string
		avatar?: string
		type?: string
	}
}
