export type Locale = 'zh-CN' | 'en-US'

export interface LocaleMessages {
	login: {
		title: string
		user_login_tip: string
		admin_login_tip: string
		no_entry: string
		auth_lark_err: string
		form: {
			validate: {
				email: string
				mobile: string
			}
		}
	}
	layout: {
		logout: string
		setting: {
			title: string
			update_menu: {
				title: string
				desc: string
				btn_text: string
				feedback: string
			}
			language: {
				title: string
			}
			theme: {
				title: string
			}
		}
	}
}
