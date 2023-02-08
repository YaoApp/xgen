export type TaskType = 'task' | 'milestone' | 'project'
export type TaskTypeInternal = TaskType | 'smalltask'

export interface Task {
	id: string
	type: 'task' | 'milestone' | 'project'
	name: string
	start: Date
	end: Date
	progress: number
	isDisabled?: boolean
	project?: string
	dependencies?: string[]
	hideChildren?: boolean
	displayOrder?: number
	styles?: {
		backgroundColor?: string
		backgroundSelectedColor?: string
		progressColor?: string
		progressSelectedColor?: string
	}
}

export interface BarTask extends Task {
	index: number
	typeInternal: TaskTypeInternal
	x1: number
	x2: number
	y: number
	height: number
	progressX: number
	progressWidth: number
	barCornerRadius: number
	handleWidth: number
	barChildren: BarTask[]
	styles: {
		backgroundColor: string
		backgroundSelectedColor: string
		progressColor: string
		progressSelectedColor: string
	}
}