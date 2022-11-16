import type { Common } from '@/types'
import type Model from './model'

export type ActionType = 'fold' | 'add' | 'remove' | 'addChild'
export type ParentIds = Array<string | number>

export interface IProps {
	setting: Array<Common.EditColumn>
	list: Array<any>
	showLabel?: boolean
	onChangeForm?: (v: Array<any>) => void
}

export interface IPropsFilter {
	onAdd: Model['onAdd']
}

export interface IPropsList {
	setting: IProps['setting']
	list: IProps['list']
	showLabel: IProps['showLabel']
	parentIds?: Array<string | number>
	onSort: Model['onSort']
	onAction: Model['onAction']
}

export interface IPropsRow {
	setting: IProps['setting']
	showLabel: IProps['showLabel']
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
	setting: IProps['setting']
	showLabel: IProps['showLabel']
	dataItem: IPropsRow['dataItem']
}

export interface IPropsFormItem {
	showLabel: IProps['showLabel']
	item: Common.EditColumn
}
