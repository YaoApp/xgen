import type { Common } from '@/types'

export type ActionType = 'fold' | 'add' | 'remove' | 'addChild'
export type ParentIds = Array<string | number>

export interface IProps {
	setting: Array<Common.EditColumn>
	list: Array<any>
	onChangeForm?: (v: Array<any>) => void
}

export interface IPropsFilter {
	onAdd: (parentIds: ParentIds) => void
}

export interface IPropsList {
	list: IProps['list']
	parentIds?: Array<string | number>
	onChange: (v: Array<any>, parentIds?: ParentIds) => void
	onAction: (type: ActionType, parentIds: ParentIds) => void
}

export interface IPropsRow {
	dataItem: any
	parentIds: ParentIds
	fold: boolean
	onAction: IPropsList['onAction']
}

export interface IPropsActions {
	parentIds: IPropsRow['parentIds']
	fold: IPropsRow['fold']
	hasChildren: boolean
	onAction: IPropsRow['onAction']
}

export interface IPropsFields {
	dataItem: IPropsRow['dataItem']
}
