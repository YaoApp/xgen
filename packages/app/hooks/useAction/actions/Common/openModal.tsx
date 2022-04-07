import ReactDom from 'react-dom'

import Modal from '@/components/base/Modal'

import { createModalContainer } from '../../utils'

import type { IProps as IPropsModal } from '@/components/base/Modal'
import type { OnAction } from '../../index'

export default ({ namespace, primary, it }: Omit<OnAction, 'data_item'>) => {
	const props_modal: IPropsModal = {
		namespace,
		primary,
		config: it.action['Common.openModal']!
	}

	ReactDom.render(<Modal {...props_modal}></Modal>, createModalContainer())
}
