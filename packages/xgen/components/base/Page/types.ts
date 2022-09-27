import type { GlobalModel } from '@/context/app'
import type { Action } from '@/types'
import type { ReactNode } from 'react'

export interface IProps {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	title?: string
	actions?: Array<Action.Props>
      isChart?: boolean
	customAction?: ReactNode
}

export interface IPropsLeft {
	title: string
	visible_menu: GlobalModel['visible_menu']
	toggleMenu: GlobalModel['toggleMenu']
}
