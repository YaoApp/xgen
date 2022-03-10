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

		localStorage.setItem('xgen-theme', theme)
		document.documentElement.setAttribute('data-theme', theme)
		document.documentElement.style.colorScheme = theme

		ConfigProvider.config({
			prefixCls: 'xgen',
			theme: {
                        primaryColor: '#3371fc'
                  }
		})
	}
}
