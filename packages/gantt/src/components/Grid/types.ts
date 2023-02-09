import type { Task } from '@/types'

export interface IPropsGrid {
	tasks: Task[]
	dates: Date[]
	svgWidth: number
	rowHeight: number
	columnWidth: number
	todayColor: string
	rtl: boolean
}
