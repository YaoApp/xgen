import postcssLightningcss from 'postcss-lightningcss'
import { defineConfig } from 'rollup'
import postcss from 'rollup-plugin-postcss'

import { nodeResolve } from '@rollup/plugin-node-resolve'

import type { BundleOptions } from 'lightningcss'

export const plugins = [
	nodeResolve(),
	postcss({
		plugins: [
			postcssLightningcss({
				cssModules: true,
				drafts: { nesting: true }
			} as BundleOptions)
		]
	})
]

export default defineConfig({
	input: 'src/index.tsx',
	output: {
		dir: 'dist',
		format: 'esm',
		chunkFileNames: '[name].js'
	},
	external: ['react', 'react-dom', 'react/jsx-runtime'],
	// When using tsyringe, this item needs to be set
	context: 'false'
})
