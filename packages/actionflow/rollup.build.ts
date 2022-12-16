import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import { defineRollupSwcMinifyOption, minify, swc } from 'rollup-plugin-swc3'

import config, { plugins } from './rollup.common'

export default defineConfig({
	...config,
	plugins: [
		...plugins,
		swc(),
		minify(
			defineRollupSwcMinifyOption({
				compress: { drop_console: false }
			})
		),
		del({ targets: 'dist/*' })
	]
})
