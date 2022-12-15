import type { Common, Chart } from '@/types'
import type { ReactNode } from 'react'

export interface IProps {
	children: React.ReactNode
	title?: string
	className?: string
	style?: React.CSSProperties
	actions?: Chart.Setting['actions']
	withRows?: boolean
	customAction?: ReactNode
	full?: Common.Config['full']
}

export interface IPropsLeft {
	title: string | undefined
}

export interface IPropsActions {
	actions: IProps['actions']
}
