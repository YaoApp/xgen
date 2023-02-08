import type { DateSetup, ViewMode } from '@/types'

export interface IPropsTop {
	value: string
	x1Line: number
	y1Line: number
	y2Line: number
	xText: number
	yText: number
}

export type IPropsCalendar = {
	dateSetup: DateSetup
	locale: string
	viewMode: ViewMode
	rtl: boolean
	headerHeight: number
	columnWidth: number
	fontFamily: string
	fontSize: string
}
