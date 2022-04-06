import Layout from './layout'
import Login from './login'
import Messages from './messages'
import Page from './page'

export type Locale = 'zh-CN' | 'en-US'

export interface LocaleMessages {
	layout: Layout
	login: Login
	page: Page
	messages: Messages
}
