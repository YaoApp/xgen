export declare namespace App {
	type Theme = 'light' | 'dark'

	interface Info {
		/** Application Name */
		name: string
		/** Application description */
		description?: string
		/** runtime mode, note: may affect user experience! */
		mode?: 'development' | 'production'
		/** api prefix, default is __yao */
            apiPrefix?: string
		/** login config */
		login: {
			/** Configure the jump page after administrator and user login */
			entry: {
				admin: string
				user: string
			}
			/** Configure the staff login related apis */
			user?: {
				captcha: string
				login: string
			}
			/** Display and configure the Feishu login interface */
			feishu?: {
				authUrl: string
				login: string
			}
		}
		icons?: {
			png: string
		}
		/** define token behavior, default is sessionStorage */
		token?: {
			/** way of token storage */
			storage: 'sessionStorage' | 'localStorage'
		}
		optional?: {
			/** Hide the navigation bar notification */
			hideNotification?: boolean
			/** Hide the navigation bar setting */
			hideSetting?: boolean
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
		visible_menu?: boolean
		blocks?: boolean
		children?: Array<Menu>
		parent?: any
	}
}
