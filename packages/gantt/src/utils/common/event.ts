import type { MouseEvent, KeyboardEvent, FocusEvent } from 'react'

export const isKeyboardEvent = (event: MouseEvent | KeyboardEvent | FocusEvent): event is KeyboardEvent => {
	return (event as KeyboardEvent).key !== undefined
}

export const isMouseEvent = (event: MouseEvent | KeyboardEvent | FocusEvent): event is MouseEvent => {
	return (event as MouseEvent).clientX !== undefined
}
