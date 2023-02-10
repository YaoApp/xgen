import { useMemo } from 'react'

import styles from './index.css'

import type { IPropsTooltipContent } from '../../types'

const Index = (props: IPropsTooltipContent) => {
	const { task, fontSize, fontFamily } = props

	const detail = useMemo(() => {
		const start = `${task.start.getDate()}-${task.start.getMonth() + 1}-${task.start.getFullYear()}`
		const end = `${task.end.getDate()}-${task.end.getMonth() + 1}-${task.end.getFullYear()}`

		return `${task.name}: ${start} - ${end}`
	}, [task])

	const duration = useMemo(() => {
		if (task.end.getTime() - task.start.getTime() === 0) return null

		const duration_time = `${~~((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24))}`

		return <p className={styles.tooltipDefaultContainerParagraph}>{`Duration: ${duration_time} day(s)`}</p>
	}, [])

	return (
		<div className={styles.tooltipDefaultContainer} style={{ fontSize, fontFamily }}>
			<b style={{ fontSize: fontSize + 6 }}>{detail}</b>
			{duration}
			<p className={styles.tooltipDefaultContainerParagraph}>
				{!!task.progress && `Progress: ${task.progress} %`}
			</p>
		</div>
	)
}

export default Index
