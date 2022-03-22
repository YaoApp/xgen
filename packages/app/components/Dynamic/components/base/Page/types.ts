import type { GlobalModel } from '@/context/app'

interface Action {
	title: string
	icon: string
	action?: string
	payload?: any
	onClick?: () => void
}

export interface IProps {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	options?: Array<Action> | JSX.Element
	isChart?: boolean
}

export interface IPropsLeft {
	title: string
	visible_menu: GlobalModel['visible_menu']
	toggleMenu: GlobalModel['toggleMenu']
}

export interface IPropsActions {}
