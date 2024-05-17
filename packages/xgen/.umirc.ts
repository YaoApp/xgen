import { defineConfig } from '@umijs/max'

import { base, chainWebpack, conventionRoutes, links, metas, proxy, srcTranspilerOptions } from './build/config'

export default defineConfig({
	mfsu: { esbuild: false, strategy: 'eager', exclude: [] },
	srcTranspiler: 'swc',
	srcTranspilerOptions,
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
	conventionRoutes,
	define: { $runtime: { BASE: process.env.BASE } },
	// @ts-ignore
	chainWebpack
})
