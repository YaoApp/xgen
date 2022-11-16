import type { Common } from '@/types'
import type Model from './model'

export type ActionType = 'fold' | 'add' | 'remove' | 'addChild'
export type ParentIds = Array<string | number>

export interface IProps {
	setting: Array<Common.EditColumn>
	list: Array<any>
	onChangeForm?: (v: Array<any>) => void
}

export interface IPropsFilter {
	onAdd: Model['onAdd']
}

export interface IPropsList {
	list: IProps['list']
	parentIds?: Array<string | number>
	onSort: Model['onSort']
	onAction: Model['onAction']
}

export interface IPropsRow {
	dataItem: any
	parentIds: ParentIds
	fold: boolean
	onAction: Model['onAction']
}

export interface IPropsActions {
	parentIds: IPropsRow['parentIds']
	fold: IPropsRow['fold']
	hasChildren: boolean
	onAction: Model['onAction']
}

export interface IPropsFields {
	dataItem: IPropsRow['dataItem']
}
