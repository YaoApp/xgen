import Layout from './layout'
import Login from './login'
import Messages from './messages'

export type Locale = 'zh-CN' | 'en-US'

export interface LocaleMessages {
	layout: Layout
	login: Login
	messages: Messages
}
