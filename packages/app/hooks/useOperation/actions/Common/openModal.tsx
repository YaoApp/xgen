import ReactDom from 'react-dom'

import Modal from '@/components/base/Modal'

import { createModalContainer } from '../../utils'

import type { IProps as IPropsModal } from '@/components/base/Modal'
import type { HandleOperation } from '../../index'

export default ({ namespace, primary, it }: Omit<HandleOperation, 'data_item'>) => {
	const props_modal: IPropsModal = {
		namespace,
		primary,
		config: it.action['Common.openModal']!
	}

	ReactDom.render(<Modal {...props_modal}></Modal>, createModalContainer())
}
