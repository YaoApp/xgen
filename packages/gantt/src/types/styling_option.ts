import type { Task } from './task'

export interface StylingOption {
	headerHeight?: number
	columnWidth?: number
	listCellWidth?: string
	rowHeight?: number
	ganttHeight?: number
	barCornerRadius?: number
	handleWidth?: number
	fontFamily?: string
	fontSize?: string
	barFill?: number
	barProgressColor?: string
	barProgressSelectedColor?: string
	barBackgroundColor?: string
	barBackgroundSelectedColor?: string
	projectProgressColor?: string
	projectProgressSelectedColor?: string
	projectBackgroundColor?: string
	projectBackgroundSelectedColor?: string
	milestoneBackgroundColor?: string
	milestoneBackgroundSelectedColor?: string
	arrowColor?: string
	arrowIndent?: number
	todayColor?: string
	TooltipContent?: React.FC<{
		task: Task
		fontSize: string
		fontFamily: string
	}>
	TaskListHeader?: React.FC<{
		headerHeight: number
		rowWidth: string
		fontFamily: string
		fontSize: string
	}>
	TaskListTable?: React.FC<{
		rowHeight: number
		rowWidth: string
		fontFamily: string
		fontSize: string
		locale: string
		tasks: Task[]
		selectedTaskId: string
		setSelectedTask: (taskId: string) => void
		onExpanderClick: (task: Task) => void
	}>
}
