import { ConfigProvider, Modal } from 'antd'
import en_US from 'antd/es/locale/en_US'
import zh_CN from 'antd/es/locale/zh_CN'
import { useMemo, useState } from 'react'
import { container } from 'tsyringe'

import { GlobalContext, GlobalModel } from '@/context/app'
import { getLocale } from '@umijs/max'

import styles from './index.less'

import type { CSSProperties } from 'react'
import type { IPropsModalWrap } from '../types'

const Index = (props: IPropsModalWrap) => {
	const { children, width, visible, mask, parent_width, onBack } = props
	const locale = getLocale()
	const [global] = useState(() => container.resolve(GlobalModel))
	const is_cn = locale === 'zh-CN'

	const wrapProps = useMemo(() => {
		if (mask) return {}
		if (!parent_width) return {}
		if (!width) return {}

		return {
			style: {
				width,
				margin: 'unset',
				marginLeft: `calc((100vw - ${parent_width} - ${width}) / 2 + ${parent_width} + 3px)`
			} as CSSProperties
		}
      }, [ width, mask, parent_width ])

	return (
		<ConfigProvider prefixCls='xgen' locale={is_cn ? zh_CN : en_US}>
			<Modal
				wrapClassName={styles._local}
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
				wrapProps={wrapProps}
			>
				<GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>
			</Modal>
		</ConfigProvider>
	)
}

export default window.$app.memo(Index)
