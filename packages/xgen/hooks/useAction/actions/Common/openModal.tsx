import { createRoot } from 'react-dom/client'

import Modal from '@/components/base/Modal'

import { createModalContainer } from '../../utils'

import type { IProps as IPropsModal } from '@/components/base/Modal'
import type { OnAction } from '../../index'
import type { Action } from '@/types'

type Args = Omit<OnAction, 'it'> & { payload: Action.ActionMap['Common.openModal'] }

export default ({ namespace, primary, data_item, payload }: Args) => {
	const props_modal: IPropsModal = {
		namespace,
		id: data_item ? data_item[primary] : 0,
		config: payload
	}

	createRoot(createModalContainer(namespace)).render(<Modal {...props_modal}></Modal>)
}
