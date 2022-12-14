import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'

import config from './rollup.common'

export default defineConfig({
	...config,
	plugins: [dts()]
})
