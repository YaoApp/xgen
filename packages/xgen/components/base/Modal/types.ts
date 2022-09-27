import type { Action } from '@/types'

export interface IPropsModalWrap {
	children: React.ReactNode
	width?: Action.OpenModal['width']
	visible: boolean
	onBack: () => void
}
