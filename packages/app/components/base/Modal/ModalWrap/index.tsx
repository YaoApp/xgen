import { ConfigProvider, Modal } from 'antd'

import styles from './index.less'

import type { IPropsModalWrap } from '../types'

const Index = (props: IPropsModalWrap) => {
	const { children, width, visible, onBack } = props

	return (
		<ConfigProvider prefixCls='xgen'>
			<Modal
				wrapClassName={styles._local}
				width={width ?? 900}
				visible={visible}
				onCancel={onBack}
				destroyOnClose
				footer={false}
				closable={false}
				maskClosable={false}
				bodyStyle={{ padding: 0 }}
			>
				{children}
			</Modal>
		</ConfigProvider>
	)
}

export default window.$app.memo(Index)
