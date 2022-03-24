import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import Service from './services'

import type { SettingTable } from '@/types'

@injectable()
export default class Model {
	model: string = ''
	setting = {} as SettingTable

	constructor(public service: Service) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getSetting() {
		const { res, err } = await this.service.getSetting<SettingTable>(this.model)

		if (err) return

		this.setting = res
	}
}
