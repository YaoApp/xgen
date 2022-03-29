import { defineConfig } from '@umijs/max'

import { chainWebpack, conventionRoutes, links, proxy } from './build/config'
import config from './config'

export default defineConfig({
      mfsu: { esbuild: true },
	monorepoRedirect: { srcDir: ['./'] },
	npmClient: 'pnpm',
	base: config.base,
	publicPath: config.base,
	proxy,
	links,
	moment2dayjs: {},
	antd: { import: false },
	locale: { default: 'zh-CN', antd: true, baseNavigator: true },
	polyfill: { imports: ['core-js/features/promise/try'] },
	extraBabelPlugins: ['babel-plugin-transform-typescript-metadata'],
	chainWebpack,
	conventionRoutes
})