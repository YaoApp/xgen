import { ConfigProvider, Modal } from 'antd'
import en_US from 'antd/es/locale/en_US'
import zh_CN from 'antd/es/locale/zh_CN'
import { useState } from 'react'
import { container } from 'tsyringe'

import { GlobalContext, GlobalModel } from '@/context/app'
import { getLocale } from '@umijs/max'

import styles from './index.less'

import type { IPropsModalWrap } from '../types'

const Index = (props: IPropsModalWrap) => {
	const { children, width, visible, onBack } = props
	const locale = getLocale()
	const [global] = useState(() => container.resolve(GlobalModel))
	const is_cn = locale === 'zh-CN'

	return (
		<ConfigProvider prefixCls='xgen' locale={is_cn ? zh_CN : en_US}>
			<Modal
				wrapClassName={styles._local}
				width={width ?? 900}
				open={visible}
				onCancel={onBack}
				destroyOnClose
				footer={false}
				closable={false}
				maskClosable={false}
				bodyStyle={{ padding: 0 }}
			>
				<GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>
			</Modal>
		</ConfigProvider>
	)
}

export default window.$app.memo(Index)
