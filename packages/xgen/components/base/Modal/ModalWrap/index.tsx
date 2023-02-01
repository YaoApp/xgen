import { Modal } from 'antd'

import styles from './index.less'

import type { IPropsModalWrap } from '../types'

const Index = (props: IPropsModalWrap) => {
	const { children, width, visible, mask = true, onBack } = props

	return (
		<Modal
			wrapClassName={styles._local}
			className='__open_modal_content_wrap'
			width={width}
			open={visible}
			mask={mask}
			onCancel={onBack}
			destroyOnClose
			footer={false}
			closable={false}
			maskClosable={false}
			getContainer={false}
			bodyStyle={{ padding: 0 }}
		>
			{children}
		</Modal>
	)
}

export default window.$app.memo(Index)
