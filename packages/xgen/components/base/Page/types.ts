import type { Common, Chart } from '@/types'
import type { ReactNode } from 'react'
import type { GlobalModel } from '@/context/app'

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
	visible_menu: GlobalModel['visible_menu']
	toggleVisibleMenu: () => void
}

export interface IPropsActions {
	actions: IProps['actions']
}
