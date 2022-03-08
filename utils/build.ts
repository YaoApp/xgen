export const env = process.env.NODE_ENV as 'development' | 'production'

export const optimization = {
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
}