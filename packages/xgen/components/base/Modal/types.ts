import type { Action } from '@/types'
import type { ModalProps } from 'antd'

export interface IPropsModalWrap {
	children: React.ReactNode
	visible: boolean
	config: Action.OpenModal
	width?: Action.OpenModal['width']
	mask?: ModalProps['mask']
	onBack: () => void
}
