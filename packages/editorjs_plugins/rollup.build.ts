import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import { minify } from 'rollup-plugin-swc3'

import config, { plugins } from './rollup.common'

export default defineConfig({
	...config,
	plugins: [...plugins, minify(), del({ targets: 'dist/*' })]
})
