import { defineConfig } from 'rollup'

import { nodeResolve } from '@rollup/plugin-node-resolve'

export const plugins = [nodeResolve()]

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
