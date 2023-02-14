import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

import { Bar, Milestone, Project, SmallBar } from './components'
import styles from './index.css'

import type { IPropsTaskItem } from './types'

const Index = (props: IPropsTaskItem) => {
	const { task, arrowIndent, taskHeight, isDelete, isSelected, rtl, onEventStart } = props
	const textRef = useRef<SVGTextElement>(null)
	const [isTextInside, setIsTextInside] = useState(true)

	useEffect(() => {
		if (!textRef.current) return

		setIsTextInside(textRef.current.getBBox().width < task.x2 - task.x1)
	}, [textRef, task])

	const TaskItem = useMemo(() => {
		switch (task.typeInternal) {
			case 'milestone':
				return <Milestone {...props} />
				break
			case 'project':
				return <Project {...props} />
				break
			case 'smalltask':
				return <SmallBar {...props} />
				break
			default:
				return <Bar {...props} />
				break
		}
	}, [props, task, isSelected])

	const x = useMemo(() => {
		const width = task.x2 - task.x1
		const hasChild = task.barChildren.length > 0

		if (isTextInside) {
			return task.x1 + width * 0.5
		}

		if (rtl && textRef.current) {
			return task.x1 - textRef.current.getBBox().width - arrowIndent * +hasChild - arrowIndent * 0.2
		} else {
			return task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2
		}
	}, [task])

	return (
		<g
			onKeyDown={(e) => {
				if (e.key === 'Delete') if (isDelete) onEventStart('delete', task, e)

				e.stopPropagation()
			}}
			onMouseEnter={(e) => onEventStart('mouseenter', task, e)}
			onMouseLeave={(e) => onEventStart('mouseleave', task, e)}
			onDoubleClick={(e) => onEventStart('dblclick', task, e)}
			onClick={(e) => onEventStart('click', task, e)}
			onFocus={() => onEventStart('select', task)}
		>
			<Fragment>
				{TaskItem}
				<text
					x={x}
					y={task.y + taskHeight * 0.5}
					className={isTextInside ? styles.barLabel : styles.barLabel && styles.barLabelOutside}
					ref={textRef}
				>
					{task.name}
				</text>
			</Fragment>
		</g>
	)
}

export default Index
