import type { GlobalModel } from '@/context/app'

export interface Action {
	title: string
	icon: string
	action?: {
		type: string
		payload?: any
	}
	onClick?: () => void
}

export interface IProps {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	actions?: Array<Action> | JSX.Element
	isChart?: boolean
}

export interface IPropsLeft {
	title: string
	visible_menu: GlobalModel['visible_menu']
	toggleMenu: GlobalModel['toggleMenu']
}
