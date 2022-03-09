import { defineConfig } from '@umijs/pro'

import config from './config'
import { chainWebpack, proxy } from './utils/build'

export default defineConfig({
	mfsu: { esbuild: true },
	npmClient: 'pnpm',
	base: config.base,
	publicPath: config.base,
	proxy,
	request: {},
	moment2dayjs: {},
	antd: { import: true, style: 'less' },
	locale: { default: 'zh-CN', antd: true, baseNavigator: true },
	links: [{ rel: 'stylesheet', href: `${config.base}icon_font.css` }],
	polyfill: { imports: ['core-js/features/promise/try', 'core-js/proposals/math-extensions'] },
	chainWebpack
})
