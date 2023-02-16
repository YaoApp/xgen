import { useEffect } from 'react'

import type { GanttProps } from '@/types'
import type { RefObject } from 'react'

interface HookProps extends Pick<GanttProps, 'ganttHeight' | 'rtl'> {
	wrapperRef: RefObject<HTMLDivElement>
	svgWidth: number
	ganttFullHeight: number
	scrollX: number
	scrollY: number
	setScrollX: (v: number) => void
	setScrollY: (v: number) => void
	setIgnoreScrollEvent: (v: boolean) => void
}

export default (props: HookProps) => {
	const {
		ganttHeight,
		rtl,
		wrapperRef,
		svgWidth,
		ganttFullHeight,
		scrollX,
		scrollY,
		setScrollX,
		setScrollY,
		setIgnoreScrollEvent
	} = props

	useEffect(() => {
		const handleWheel = (event: WheelEvent) => {
			if (event.shiftKey || event.deltaX) {
				const scrollMove = event.deltaX ? event.deltaX : event.deltaY
				let newScrollX = scrollX + scrollMove
				if (newScrollX < 0) {
					newScrollX = 0
				} else if (newScrollX > svgWidth) {
					newScrollX = svgWidth
				}

				setScrollX(newScrollX)

				event.preventDefault()
			} else if (ganttHeight) {
				let newScrollY = scrollY + event.deltaY

				if (newScrollY < 0) {
					newScrollY = 0
				} else if (newScrollY > ganttFullHeight - ganttHeight) {
					newScrollY = ganttFullHeight - ganttHeight
				}

				if (newScrollY !== scrollY) {
					setScrollY(newScrollY)
					event.preventDefault()
				}
			}

			setIgnoreScrollEvent(true)
		}

		wrapperRef.current?.addEventListener('wheel', handleWheel, { passive: false })

		return () => wrapperRef.current?.removeEventListener('wheel', handleWheel)
	}, [wrapperRef, scrollX, scrollY, ganttHeight, svgWidth, rtl, ganttFullHeight])
}
