import type { MouseEvent as RCMouseEvent } from 'react'

export interface IPropsDate {
	x: number
	y: number
	width: number
	height: number
	barCornerRadius: number
	onMouseDown: (event: RCMouseEvent<SVGRectElement, MouseEvent>) => void
}

export interface IPropsDisplay {
	x: number
	y: number
	width: number
	height: number
	isSelected: boolean
	progressX: number
	progressWidth: number
	barCornerRadius: number
	styles: {
		backgroundColor: string
		backgroundSelectedColor: string
		progressColor: string
		progressSelectedColor: string
	}
	onMouseDown: (event: RCMouseEvent<SVGPolygonElement, MouseEvent>) => void
}

export interface IPropsProgress {
	progressPoint: string
	onMouseDown: (event: RCMouseEvent<SVGPolygonElement, MouseEvent>) => void
}
