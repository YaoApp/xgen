import type { Common } from '@/types'
import type Model from './model'

export type ActionType = 'fold' | 'add' | 'remove' | 'addChild'
export type ParentIds = Array<string | number>

export interface IProps {
	setting: Array<Common.EditColumn>
	list: Array<any>
	hasChildren?: boolean
	showLabel?: boolean
	builder?: boolean
	props?: {
		placeholder?: string
		[key: string]: any
	}
	onChangeForm?: (v: Array<any> | { data: Array<any>; delete: Array<string | number> }) => void
}

export interface IPropsEmpty {
	builder?: boolean
	placeholder?: string
	onAdd: Model['onAdd']
}

export interface IPropsList {
	setting: IProps['setting']
	list: IProps['list']
	showLabel: IProps['showLabel']
	hasChildren: IProps['hasChildren']
	parentIds?: Array<string | number>
	builder?: boolean
	onSort: Model['onSort']
	onAction: Model['onAction']
	onChange: Model['onChange']
	__shadow_host_ref?: React.RefObject<HTMLDivElement>
}

export interface IPropsRow {
	setting: IProps['setting']
	showLabel: IProps['showLabel']
	hasChildren: IProps['hasChildren']
	dataItem: any
	parentIds: ParentIds
	fold: boolean
	builder?: boolean
	onAction: Model['onAction']
	onChange: Model['onChange']
	__shadow_host_ref?: React.RefObject<HTMLDivElement>
}

export interface IPropsActions {
	hasChildren: IProps['hasChildren']
	parentIds: IPropsRow['parentIds']
	fold: IPropsRow['fold']
	showFoldAction: boolean
	onAction: Model['onAction']
}

export interface IPropsFields {
	setting: IProps['setting']
	showLabel: IProps['showLabel']
	builder?: boolean
	hasChildren: IProps['hasChildren']
	dataItem: IPropsRow['dataItem']
	parentIds: ParentIds
	onChange: Model['onChange']
	__shadow_host_ref?: React.RefObject<HTMLDivElement>
}

export interface IPropsFormItem {
	showLabel: IProps['showLabel']
	item: Common.EditColumn
	__shadow_host_ref?: React.RefObject<HTMLDivElement>
}
