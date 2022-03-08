import { defineConfig } from '@umijs/pro'

import config from './config'
import { env, optimization } from './utils/build'

export default defineConfig({
	// srcTranspiler: 'swc',
	mfsu: { esbuild: true },
	npmClient: 'pnpm',
	base: config.base,
	publicPath: config.base,
	favicon: '/favicon.ico',
	locale: { default: 'zh-CN', antd: true, baseNavigator: true },
	links: [{ rel: 'stylesheet', href: `${config.base}icon/md_icon.css` }],
	polyfill: { imports: ['core-js/features/promise/try', 'core-js/proposals/math-extensions'] },
	proxy: {
		'/api': {
			target: 'http://local.iqka.com:5099',
			changeOrigin: true
		},
		'/extend': {
			target: 'http://local.iqka.com:5099',
			changeOrigin: true
		}
	},
	chainWebpack(cfg) {
		if (env === 'production') {
			cfg.merge(optimization)
		}
	}
})
