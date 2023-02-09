import type { BarTask } from '@/types'

export interface IPropsArrow {
	taskFrom: BarTask
	taskTo: BarTask
	rowHeight: number
	taskHeight: number
	arrowIndent: number
	rtl: boolean
}
