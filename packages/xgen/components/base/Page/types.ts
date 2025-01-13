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
	enableXterm?: boolean
	enableAIEdit?: boolean
	formActions?: ReactNode
	type?: 'Form' | 'Table' | 'Other'
}

export interface IPropsLeft {
	title: string | undefined
	visible_menu: GlobalModel['visible_menu']
	layout: GlobalModel['layout']
	toggleVisibleMenu: () => void
}

export interface IPropsActions {
	actions: IProps['actions']
}

export interface IDevControls {
	enableXterm?: boolean
	enableAIEdit?: boolean
}
