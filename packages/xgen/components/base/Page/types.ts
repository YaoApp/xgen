import type { Common, Chart } from '@/types'
import type { ReactNode } from 'react'

export interface IProps {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	actions?: Chart.Setting['operation']['actions']
	isChart?: boolean
	customAction?: ReactNode
	full?: Common.Config['full']
}

export interface IPropsLeft {
	title: string | undefined
}

export interface IPropsActions {
	actions: IProps['actions']
}
