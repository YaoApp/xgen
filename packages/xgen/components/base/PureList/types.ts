import type { Common } from '@/types'

export interface IProps {
	setting: Array<Common.EditColumn>
	list: Array<any>
	onChangeForm?: (v: Array<any>) => void
}

export interface IPropsList {
	list: IProps['list']
	parentId?: string
	onChange: (v: Array<any>, parentId?: string) => void
}

export interface IPropsRow {
	dataItem: any
}
