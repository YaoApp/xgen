import { ConfigProvider } from 'antd'
import { makeAutoObservable } from 'mobx'
import { singleton } from 'tsyringe'

import Service from '@/services/app'

export type Theme = 'light' | 'dark'

@singleton()
export default class Model {
	theme: Theme = 'light'

	constructor(public service: Service) {
		makeAutoObservable(this, {}, { autoBind: true })

		const theme = (localStorage.getItem('xgen-theme') || 'light') as Theme

		this.setTheme(theme)
		this.getAppInfo()
	}

	setTheme(theme: Theme) {
		this.theme = theme

		localStorage.setItem('xgen-theme', theme)
		document.documentElement.setAttribute('data-theme', theme)
		document.documentElement.style.colorScheme = theme

		ConfigProvider.config({
			prefixCls: 'xgen',
			theme: {
				primaryColor: theme === 'light' ? '#3371fc' : '#4e7adf'
			}
		})
	}

	*getAppInfo(): Generator {
		const res = yield this.service.getAppInfo()

		console.log(res)
	}
}
