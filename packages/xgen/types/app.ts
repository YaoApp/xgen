import type { Action, Common } from '@/types'

export declare namespace App {
	type Theme = 'light' | 'dark'

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

	type ChatAI = {
		is_neo: boolean
		text: string
		done: boolean
		confirm?: boolean
		actions?: Array<Action.ActionParams>
		command?: ChatCmd
	}

	type ChatHuman = {
		is_neo: boolean
		text: string
		context?: {
			namespace: string
			stack: string
			pathname: string
			formdata: any
			field?: Omit<Field, 'config'>
			config?: Common.FieldDetail
			signal?: ChatContext['signal']
		}
	}

	type ChatInfo = ChatHuman | ChatAI

	type ChatHistory = {
		command?: ChatCmd
		data: Array<{
			content: string
			role: 'user' | 'assistant'
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
		optional?: {
			/** remote api cache, default is true */
			remoteCache?: boolean
			/** neo config, for chatgpt service */
			neo?: { api: string; studio?: boolean }
			/** menu config, default is { layout:"2-columns", hide:false, showName:false }  */
			menu?: { layout: '1-column' | '2-columns'; hide?: boolean; showName?: boolean }
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
		items: Array<App.Menu>
		setting: Array<App.Menu>
	}
}
