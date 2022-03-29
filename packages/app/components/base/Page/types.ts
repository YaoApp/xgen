import type { GlobalModel } from '@/context/app'

export interface Action {
	title: string
	icon: string
	props: {
		type: string
		payload: any
	}
}

export interface IProps {
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	actions?: Array<Action>
	isChart?: boolean
}

export interface IPropsLeft {
	title: string
	visible_menu: GlobalModel['visible_menu']
	toggleMenu: GlobalModel['toggleMenu']
}
