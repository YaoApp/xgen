import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { ColumnUtils, Common } from '@/services'

import type { List, Common as CommonType } from '@/types'
import { IProps } from 'ahooks/lib/useWhyDidYouUpdate'

@injectable()
export default class Model {
	props = {} as IProps
	columns = [] as Array<CommonType.EditColumn>
	listProps: List.Setting['list']['props'] = {
		placeholder: 'Add Item'
	}

	constructor(private common: Common, private column_utils: ColumnUtils) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async getSetting() {
		const { name, id, __namespace, __primary, __type, ...rest_props } = this.props
		const params: Record<string, any> = { id, __namespace, __primary, __type }
		for (const key in rest_props) {
			if (typeof rest_props[key] == 'object' || typeof rest_props[key] == 'function') {
				continue
			}
			if (rest_props[key] === undefined) {
				continue
			}
			params[key] = rest_props[key]
		}

		const { res, err } = await this.common.getSetting<List.Setting>('list', name, params)
		if (err) return
		if (res.list.columns && res.list.columns?.length) {
			this.columns = this.column_utils.reduceAny<
				CommonType.BaseColumn,
				CommonType.EditColumn,
				CommonType.EditFields
			>(res.list.columns, res.fields.list)
		}

		if (res.list.props) {
			this.listProps = res.list.props
		}
	}

	init(props: IProps) {
		this.props = props
		this.getSetting()
	}
}
