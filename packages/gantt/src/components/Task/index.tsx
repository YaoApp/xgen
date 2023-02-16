import { useEffect, useRef } from 'react'

import Calendar from '../Calendar'
import Grid from '../Grid'
import { Content } from './components'
import styles from './index.css'

import type { IPropsTask } from './types'

const Index = (props: IPropsTask) => {
	const { gridProps, calendarProps, barProps, ganttHeight, scrollY, scrollX } = props
	const ganttSVGRef = useRef<SVGSVGElement>(null)
	const horizontalContainerRef = useRef<HTMLDivElement>(null)
	const verticalGanttContainerRef = useRef<HTMLDivElement>(null)
	const newBarProps = { ...barProps, svg: ganttSVGRef }

	useEffect(() => {
		if (!horizontalContainerRef.current) return

		horizontalContainerRef.current.scrollTop = scrollY
	}, [scrollY])

	useEffect(() => {
		if (!verticalGanttContainerRef.current) return

		verticalGanttContainerRef.current.scrollLeft = scrollX
	}, [scrollX])

	return (
		<div className={styles.ganttVerticalContainer} ref={verticalGanttContainerRef} dir='ltr'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width={gridProps.svgWidth}
				height={calendarProps.headerHeight}
				fontFamily={barProps.fontFamily}
			>
				<Calendar {...calendarProps} />
			</svg>
			<div
				ref={horizontalContainerRef}
				className={styles.horizontalContainer}
				style={
					ganttHeight
						? { height: ganttHeight, width: gridProps.svgWidth }
						: { width: gridProps.svgWidth }
				}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width={gridProps.svgWidth}
					height={barProps.rowHeight * barProps.tasks.length}
					fontFamily={barProps.fontFamily}
					ref={ganttSVGRef}
				>
					<Grid {...gridProps} />
					<Content {...newBarProps} />
				</svg>
			</div>
		</div>
	)
}

export default Index
