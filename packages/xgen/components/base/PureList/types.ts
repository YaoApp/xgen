import type { Common } from '@/types'

export interface IProps {
	setting: Array<Common.EditColumn>
	list?: any
	onChange?: (v: any) => void
}
