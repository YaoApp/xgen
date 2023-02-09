import { useMemo } from 'react'

import type { IPropsGrid } from '../types'
import type { ReactElement } from 'react'

interface HookProps extends Pick<IPropsGrid, 'tasks' | 'rowHeight' | 'svgWidth'> {}

export default (props: HookProps) => {
	const { tasks, rowHeight, svgWidth } = props

	return useMemo(() => {
		let y = 0

		const gridRows: ReactElement[] = []
		const rowLines: ReactElement[] = [
			<line key='RowLineFirst' x='0' y1={0} x2={svgWidth} y2={0} className='gridRowLine' />
		]

		for (const task of tasks) {
			gridRows.push(
				<rect
					className='gridRow'
					x='0'
					y={y}
					width={svgWidth}
					height={rowHeight}
					key={'Row' + task.id}
				/>
			)

			rowLines.push(
				<line
					className='gridRowLine'
					x='0'
					y1={y + rowHeight}
					x2={svgWidth}
					y2={y + rowHeight}
					key={'RowLine' + task.id}
				/>
			)

			y += rowHeight
		}

		return { gridRows, rowLines, y }
	}, [tasks, rowHeight, svgWidth])
}
