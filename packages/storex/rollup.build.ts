import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import { defineRollupSwcOption, swc } from 'rollup-plugin-swc3'

import config from './rollup.common'

export default defineConfig({
	...config,
	plugins: [swc(defineRollupSwcOption({ minify: true })), del({ targets: 'dist/*' })]
})
