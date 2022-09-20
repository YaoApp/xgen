import { defineConfig } from 'father'
import { resolve } from 'path'

export default defineConfig({
	esm: { transformer: 'esbuild' },
	alias: { '@': resolve(__dirname, './src') }
})
