import type Config from 'webpack-chain'
import config from '../config'

export const env = process.env.NODE_ENV as 'development' | 'production'

export const proxy = {
	'/api': {
		target: 'http://local.iqka.com:5099',
		changeOrigin: true
	},
	'/extend': {
		target: 'http://local.iqka.com:5099',
		changeOrigin: true
	}
}

export const links = [
	{ rel: 'stylesheet', href: `${config.base}icon_font.css` },
	{ rel: 'stylesheet', href: `${config.base}theme/light.css` },
	{ rel: 'stylesheet', href: `${config.base}theme/dark.css` }
]

export const chainWebpack = (cfg: Config) => {
	if (env === 'production') {
		cfg.merge({
			optimization: {
				splitChunks: {
					chunks: 'all',
					minSize: 30000,
					minChunks: 3,
					automaticNameDelimiter: '.',
					cacheGroups: {
						vendor: {
							name: 'vendors',
							test({ resource }: any) {
								return /[\\/]node_modules[\\/]/.test(resource)
							},
							priority: 10
						}
					}
				}
			}
		})
	}
}
