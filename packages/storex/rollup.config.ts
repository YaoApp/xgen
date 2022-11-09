import { defineConfig } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import ttypescript from 'ttypescript'

import typescript from '@rollup/plugin-typescript'

export default defineConfig({
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		format: 'esm'
	},
	plugins: [
		typescript({
			typescript: ttypescript,
			compilerOptions: {
				plugins: [
					{ transform: 'typescript-transform-paths' },
					{
						transform: 'typescript-transform-paths',
						afterDeclarations: true
					}
				]
			}
		}),
		terser()
	]
})
