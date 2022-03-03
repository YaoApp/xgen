import { defineConfig } from 'umi'

import config from './config'

export default defineConfig({
	base: config.base,
	npmClient: 'pnpm',
	srcTranspiler: 'swc',
      mfsu: false,
      deadCode:{}
      // locale: { default: 'en-US', antd: true, baseNavigator: true },
      // dynamicImport: { loading: '@/components/Loader/index' }
})
