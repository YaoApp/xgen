import type { Common } from '@/types'

export interface IProps {
	setting: Array<Common.EditColumn>
	list: Array<any>
	onChangeForm?: (v: Array<any>) => void
}

export interface IPropsList {
	list: IProps['list']
	parentIds?: Array<string>
	onChange: (v: Array<any>, parentIds?: Array<string>) => void
}

export interface IPropsRow {
	dataItem: any
}
