import { ConfigProvider, Modal } from 'antd'
import en_US from 'antd/es/locale/en_US'
import zh_CN from 'antd/es/locale/zh_CN'

import { getLocale } from '@umijs/max'

import styles from './index.less'

import type { IPropsModalWrap } from '../types'

const Index = (props: IPropsModalWrap) => {
	const { children, width, visible, onBack } = props
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	return (
		<ConfigProvider prefixCls='xgen' locale={is_cn ? zh_CN : en_US}>
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
