import { defineConfig } from '@umijs/max'

import { base, chainWebpack, conventionRoutes, extraBabelPlugins, links, metas, proxy } from './build/config'

export default defineConfig({
	mfsu: { esbuild: false, strategy: 'normal' },
	monorepoRedirect: { srcDir: ['./'] },
	npmClient: 'pnpm',
	base,
	publicPath: base,
	proxy,
	links,
	metas,
	antd: { import: false, style: undefined },
	codeSplitting: { jsStrategy: 'granularChunks' },
	locale: { default: 'zh-CN', antd: true, baseNavigator: true },
	polyfill: { imports: ['core-js/features/promise/try'] },
	extraBabelPlugins,
	conventionRoutes,
	define: { $runtime: { BASE: process.env.BASE } },
	// @ts-ignore
	chainWebpack
})
