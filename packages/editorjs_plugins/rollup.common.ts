import { defineConfig } from 'rollup'

import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export const plugins = [nodeResolve(), commonjs({ requireReturnsDefault: 'auto' })]

export default defineConfig({
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		format: 'esm',
		chunkFileNames: '[name].js',
		manualChunks: {
			button: ['editorjs-button'],
			checklist: ['@editorjs/checklist'],
			code: ['@editorjs/code'],
			delimiter: ['@editorjs/delimiter'],
			header: ['@editorjs/header'],
			image: ['@editorjs/image'],
			inline_code: ['@editorjs/inline-code'],
			marker: ['@editorjs/marker'],
			nested_list: ['@editorjs/nested-list'],
			paragraph: ['@editorjs/paragraph'],
			quote: ['@editorjs/quote'],
			raw: ['@editorjs/raw'],
			table: ['@editorjs/table'],
			underline: ['@editorjs/underline'],
			warning: ['@editorjs/warning'],
			editorjs_video: ['@weekwood/editorjs-video']
		}
	},
	// When using tsyringe, this item needs to be set
	context: 'false',
	onwarn(warning) {
		if (warning.code === 'EVAL') return
	}
})
