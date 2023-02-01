import { ConfigProvider } from 'antd'
import en_US from 'antd/es/locale/en_US'
import zh_CN from 'antd/es/locale/zh_CN'

import { getLocale } from '@umijs/max'

import type { PropsWithChildren } from 'react'

const Index = ({ children }: PropsWithChildren) => {
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	return (
		<ConfigProvider prefixCls='xgen' locale={is_cn ? zh_CN : en_US}>
			{children}
		</ConfigProvider>
	)
}

export default window.$app.memo(Index)
