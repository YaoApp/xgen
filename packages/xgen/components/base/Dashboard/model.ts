import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { Namespace } from '@/models'
import { ColumnUtils, Common } from '@/services'

import type { Free, Component } from '@/types'

@injectable()
export default class Model {
	parent = 'Page' as Component.StackComponent['parent']
	model = '' as Component.StackComponent['model']
	setting = {} as Free.Setting
	columns = [] as Array<Free.TargetColumn>

	constructor(
		private common: Common,
		private column_utils: ColumnUtils,
		public global: GlobalModel,
		public namespace: Namespace
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getSetting() {
		if (this.parent === 'Page') this.global.loading = true

            const { res, err } = await this.common.getSetting<Free.Setting>('dashboard', this.model)
            
		this.global.loading = false

		if (err) return

		this.setting = res

		this.columns = this.column_utils.reduceFreeColumns(res.free.columns, res.fields.free)
	}

	init(parent: Component.StackComponent['parent'], model: Component.StackComponent['model']) {
		this.parent = parent
		this.model = model

		this.getSetting()
	}
}
