import { ConfigProvider } from 'antd'
import { makeAutoObservable } from 'mobx'

export type Theme = 'light' | 'dark'

export default class Model {
	theme: Theme = 'light'

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })

		const theme = (localStorage.getItem('xgen-theme') || 'light') as Theme

		this.setTheme(theme)
	}

	setTheme(theme: Theme) {
		this.theme = theme

		if (theme === 'light') {
			ConfigProvider.config({
				prefixCls: 'xgen-light',
				theme: { primaryColor: '#3371fc' }
			})
		} else {
			ConfigProvider.config({
				prefixCls: 'xgen-dark',
				theme: { primaryColor: '#ff5194' }
			})
		}

		localStorage.setItem('xgen-theme', theme)
		document.body.setAttribute('data-theme', theme)
	}
}
