import { makeAutoObservable, toJS } from 'mobx'
import { injectable } from 'tsyringe'

import { createId, handleChildren, updateChildren, updateValue } from './utils'

import type { ActionType, ParentIds, IProps } from './types'
import type { Common } from '@/types'

@injectable()
export default class Model {
	list = [] as Array<any>
	setting = [] as Array<Common.EditColumn>
	delete_ids = [] as Array<string | number>
	onChangeForm: IProps['onChangeForm'] | null = null

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init(initial_value: Array<any>, setting: Array<Common.EditColumn>, onChangeForm: IProps['onChangeForm']) {
		// Add id to each item in the list if it doesn't exist
		initial_value.forEach((v) => {
			if (!v.id) v.id = createId()
		})
		this.list = initial_value
		this.setting = setting
		this.onChangeForm = onChangeForm
	}

	submit() {
		if (this.delete_ids.length) {
			this.onChangeForm!({ data: toJS(this.list), delete: this.delete_ids })
		} else {
			this.onChangeForm!(toJS(this.list))
		}
	}

	onAdd(parentIds: ParentIds) {
		if (!parentIds.length) return this.list.push({ id: createId() })

		this.list = handleChildren(this.list, 'add', parentIds)
		this.submit()
	}

	onSort(v: Array<any>, parentIds?: ParentIds) {
		const list = v.filter((v) => v)

		if (!parentIds?.length) {
			this.list = list
		} else {
			this.list = updateChildren(this.list, v, parentIds)
		}

		this.submit()
	}

	onAction(type: ActionType, parentIds: ParentIds) {
		switch (type) {
			case 'fold':
				this.list = handleChildren(this.list, 'fold', parentIds)
				break
			case 'add':
				if (!parentIds.length) {
					this.list.push({ id: createId() })
				} else {
					this.list = handleChildren(this.list, 'add', parentIds)
				}

				break
			case 'addChild':
				this.list = handleChildren(this.list, 'addChild', parentIds)
				break
			case 'remove':
				this.list = handleChildren(this.list, 'remove', parentIds)

				const id = parentIds[parentIds.length - 1]

				if (typeof id === 'string' && id.startsWith('_')) break

				this.delete_ids.push(id)

				break
			default:
				break
		}

		this.submit()
	}

	onChange(v: any, parentIds: ParentIds) {
		const list = updateValue(this.list, v, parentIds)

		this.list = list

		this.submit()
	}
}
