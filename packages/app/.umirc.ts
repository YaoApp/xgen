import { defineConfig } from '@umijs/max'

import { chainWebpack, conventionRoutes, extraBabelPlugins, links, proxy } from './build/config'

export default defineConfig({
	mfsu: { esbuild: true },
	monorepoRedirect: { srcDir: ['./'] },
	npmClient: 'pnpm',
	base: process.env.BASE,
	publicPath: process.env.BASE,
	proxy,
	links,
	antd: { import: false },
	locale: { default: 'zh-CN', antd: true, baseNavigator: true },
	polyfill: { imports: ['core-js/features/promise/try'] },
	extraBabelPlugins,
	chainWebpack,
	conventionRoutes,
	define: { $runtime: { BASE: process.env.BASE } }
})
