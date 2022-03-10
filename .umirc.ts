import { defineConfig } from '@umijs/pro'

import config from './config'
import { chainWebpack, links, proxy } from './utils/build'

export default defineConfig({
	mfsu: { cacheDirectory: `${process.cwd()}/.cache` },
	npmClient: 'pnpm',
	base: config.base,
	publicPath: config.base,
      proxy,
	links,
	request: {},
	moment2dayjs: {},
	antd: { import: true, style: 'less' },
	locale: { default: 'zh-CN', antd: true, baseNavigator: true },
	polyfill: { imports: ['core-js/features/promise/try', 'core-js/proposals/math-extensions'] },
	chainWebpack
})
