import { defineConfig } from 'rollup'

import config, { plugins } from './rollup.common'

export default defineConfig({
	...config,
	plugins: [...plugins]
})
