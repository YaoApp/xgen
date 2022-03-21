import Layout from './layout'
import Login from './login'

export type Locale = 'zh-CN' | 'en-US'

export interface LocaleMessages {
	layout: Layout
	login: Login
}
