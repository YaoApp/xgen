import type { GlobalModel } from '@/context/app'
import type { Action, Common, Chart } from '@/types'
import type { ReactNode } from 'react'

export interface IProps {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	title?: string
	actions?: Chart.Setting['operation']['actions']
	isChart?: boolean
	customAction?: ReactNode
	full?: Common.Config['full']
}

export interface IPropsLeft {
	title: string
	visible_menu: GlobalModel['visible_menu']
	toggleMenu: GlobalModel['toggleMenu']
}

export interface IPropsActions {
	actions: IProps['actions']
}
