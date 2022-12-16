import { defineConfig } from 'rollup'
import { swc } from 'rollup-plugin-swc3'

import config from './rollup.common'

export default defineConfig({
	...config,
	plugins: [swc()]
})
