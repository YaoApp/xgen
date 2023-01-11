import type { Action } from '@/types'
import type { ModalProps } from 'antd'

export interface IPropsModalWrap {
	children: React.ReactNode
	width?: Action.OpenModal['width']
	visible: boolean
	mask: ModalProps['mask']
	parent_width?: string
	onBack: () => void
}
