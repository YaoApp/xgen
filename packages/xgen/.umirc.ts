import { defineConfig } from '@umijs/max'

import { base, chainWebpack, conventionRoutes, extraBabelPlugins, links, metas, proxy } from './build/config'

export default defineConfig({
	mfsu: { esbuild: false, strategy: 'eager' },
	monorepoRedirect: { srcDir: ['./'] },
	jsMinifier: 'swc',
	npmClient: 'pnpm',
	base,
	publicPath: base,
	proxy,
	links,
	metas,
	test: false,
	valtio: false,
	antd: { import: false, style: undefined },
	codeSplitting: { jsStrategy: 'granularChunks' },
	locale: { default: 'zh-CN', antd: true, baseNavigator: true },
	extraBabelPlugins,
	conventionRoutes,
	define: { $runtime: { BASE: process.env.BASE } },
	// @ts-ignore
	chainWebpack
})
