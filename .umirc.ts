import { defineConfig } from '@umijs/max'

import config from './config'
import { chainWebpack, links, proxy } from './utils/build'

export default defineConfig({
	mfsu: { esbuild: true },
	monorepoRedirect: { srcDir: ['./'] },
	npmClient: 'pnpm',
	base: config.base,
	publicPath: config.base,
	proxy,
	links,
	moment2dayjs: {},
	antd: { import: true, style: 'less' },
	locale: { default: 'zh-CN', antd: true, baseNavigator: true },
	polyfill: { imports: ['core-js/features/promise/try'] },
	extraBabelPlugins: ['babel-plugin-transform-typescript-metadata'],
	chainWebpack
})
