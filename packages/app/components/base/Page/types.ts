import type { GlobalModel } from '@/context/app'
import type { Action } from '@/types'

export interface IProps {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	title?: string
	actions?: Array<Action.Props>
	isChart?: boolean
}

export interface IPropsLeft {
	title: string
	visible_menu: GlobalModel['visible_menu']
	toggleMenu: GlobalModel['toggleMenu']
}
