import { defineConfig } from 'umi'

import config from './config'
import theme from './utils/antd'

export default defineConfig({
	base: config.base,
	theme,
	npmClient: 'pnpm',
	srcTranspiler: 'swc',
      mfsu: false,
      deadCode:{}
      // locale: { default: 'en-US', antd: true, baseNavigator: true },
      // dynamicImport: { loading: '@/components/Loader/index' }
})
