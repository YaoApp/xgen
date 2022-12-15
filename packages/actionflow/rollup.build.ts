import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import { defineRollupSwcOption, swc } from 'rollup-plugin-swc3'

import config, { plugins } from './rollup.common'

export default defineConfig({
	...config,
	plugins: [...plugins, swc(defineRollupSwcOption({ minify: true })), del({ targets: 'dist/*' })]
})
