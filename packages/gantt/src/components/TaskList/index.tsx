import { useEffect, useRef } from 'react'

import { Header, Table } from './components'

import type { IPropsTaskList } from './types'

const Index = (props: IPropsTaskList) => {
	const {
		headerHeight,
		fontFamily,
		fontSize,
		rowWidth,
		rowHeight,
		scrollY,
		tasks,
		selectedTask,
		locale,
		ganttHeight,
		taskListRef,
		horizontalContainerClass,
		setSelectedTask,
		onExpanderClick
	} = props
	const horizontalContainerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!horizontalContainerRef.current) return

		horizontalContainerRef.current.scrollTop = scrollY
	}, [scrollY])

	const headerProps = { headerHeight, fontFamily, fontSize, rowWidth }

	const tableProps = {
		rowHeight,
		rowWidth,
		fontFamily,
		fontSize,
		tasks,
		locale,
		selectedTaskId: selectedTask?.id,
		setSelectedTask,
		onExpanderClick
	}

	return (
		<div ref={taskListRef}>
			<Header {...headerProps} />
			<div
				className={horizontalContainerClass}
				ref={horizontalContainerRef}
				style={ganttHeight ? { height: ganttHeight } : {}}
			>
				<Table {...tableProps} />
			</div>
		</div>
	)
}

export default Index
