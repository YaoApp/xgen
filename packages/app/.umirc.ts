import { defineConfig } from '@umijs/max'

import {
	base, chainWebpack, conventionRoutes, extraBabelPlugins, links, proxy
} from './build/config'

export default defineConfig({
	mfsu: { esbuild: true },
	monorepoRedirect: { srcDir: ['./'] },
	npmClient: 'pnpm',
	base,
	publicPath: base,
	proxy,
	links,
	antd: { import: false },
	locale: { default: 'zh-CN', antd: true, baseNavigator: true },
	polyfill: { imports: ['core-js/features/promise/try'] },
	extraBabelPlugins,
	// @ts-ignore
	chainWebpack,
	conventionRoutes,
	define: { $runtime: { BASE: process.env.BASE } }
})
