import type Config from 'webpack-chain'

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
