import { Modal } from 'antd'

import styles from './index.less'

import type { ReactNode } from 'react'
import type { ModalProps } from 'antd'

interface IProps {
	visible: boolean
	title: string
	width?: number
	actions: ReactNode
	content: ReactNode
}

const Index = (props: IProps) => {
	const { visible, title, width, actions, content } = props

	const props_modal: ModalProps = {
		open: visible,
		centered: true,
		width: width || 900,
		footer: false,
		closable: false,
		zIndex: 100000,
		destroyOnClose: true,
		bodyStyle: { padding: 0 },
		wrapClassName: styles._local
	}

	return (
		<Modal {...props_modal}>
			<div className='modal_header w_100 border_box flex justify_between align_center'>
				<span className='title'>{title}</span>
				{actions}
			</div>
			<div className='modal_content_wrap w_100 border_box flex flex_column'>{content}</div>
		</Modal>
	)
}

export default window.$app.memo(Index)
