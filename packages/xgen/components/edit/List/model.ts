import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { ColumnUtils, Common } from '@/services'

import type { List, Common as CommonType } from '@/types'

@injectable()
export default class Model {
	name = ''
	columns = [] as Array<CommonType.EditColumn>

	constructor(private common: Common, private column_utils: ColumnUtils) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getSetting() {
		const { res, err } = await this.common.getSetting<List.Setting>('list', this.name)

            if (err) return

		if (res.list.columns && res.list.columns?.length) {
			this.columns = this.column_utils.reduceAny<
				CommonType.BaseColumn,
				CommonType.EditColumn,
				CommonType.EditFields
                        >(res.list.columns, res.fields.list)
		}
	}

	init(name: string) {
		this.name = name

		this.getSetting()
	}
}
