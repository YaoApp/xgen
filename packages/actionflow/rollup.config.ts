import { defineConfig } from 'rollup'
import { swc } from 'rollup-plugin-swc3'

export default defineConfig({
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		format: 'esm'
	},
	plugins: [swc()]
})
