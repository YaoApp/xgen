import { defineConfig } from 'rollup'

import { nodeResolve } from '@rollup/plugin-node-resolve'

export const plugins = [nodeResolve()]

export default defineConfig({
	input: 'src/index.ts',
	output: {
		dir: 'dist',
            format: 'esm',
            chunkFileNames:'[name].js',
		manualChunks: {
			to: ['await-to-js'],
			lodash: ['lodash-es'],
			mustache: ['mustache']
		},
      },
      // When using tsyringe, this item needs to be set
	context: 'false'
})
