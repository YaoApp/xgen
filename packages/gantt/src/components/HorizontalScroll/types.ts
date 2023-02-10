import { SyntheticEvent } from 'react'

export interface IPropsHorizontalScroll {
	scroll: number
	svgWidth: number
	taskListWidth: number
	rtl: boolean
	onScroll: (event: SyntheticEvent<HTMLDivElement>) => void
}
