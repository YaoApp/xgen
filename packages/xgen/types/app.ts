import type { Action } from '@/types'

export declare namespace App {
	type Theme = 'light' | 'dark'

	type ChatAI = {
		is_neo: boolean
		text: string
		done: boolean
		confirm?: boolean
		actions?: Array<Action.ActionParams>
		command?: {
			id: string
			name: string
			request: string
		}
	}

	type ChatHuman = {
		is_neo: boolean
		text: string
		context?: { stack: string; pathname: string }
	}

	type ChatInfo = ChatHuman | ChatAI

	interface Context {
		namespace: string
		primary: string
		data_item: any
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
			neo?: { api: string }
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
		name: string
		icon: string
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
