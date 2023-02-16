import type { BarTask, GanttEvent, EventOption } from '@/types'
import type { IPropsGrid } from '@/components/Grid/types'
import type { IPropsCalendar } from '@/components/Calendar/types'

export interface IPropsTask {
	gridProps: IPropsGrid
	calendarProps: IPropsCalendar
	barProps: IPropsContent
	ganttHeight: number
	scrollY: number
	scrollX: number
}

export interface IPropsContent extends EventOption {
	tasks: BarTask[]
	dates: Date[]
	ganttEvent: GanttEvent
	selectedTask: BarTask | undefined
	rowHeight: number
	columnWidth: number
	timeStep: number
	svg?: React.RefObject<SVGSVGElement>
	svgWidth: number
	taskHeight: number
	arrowColor: string
	arrowIndent: number
	fontSize: string
	fontFamily: string
	rtl: boolean
	setGanttEvent: (value: GanttEvent) => void
	setFailedTask: (value: BarTask | null) => void
	setSelectedTask: (taskId: string) => void
}
