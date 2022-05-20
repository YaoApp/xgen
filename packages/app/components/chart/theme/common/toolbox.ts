import { THEME } from '@/styles'

import type { App } from '@/types'

export default (theme: App.Theme) => ({
	iconStyle: {
		borderColor: THEME[theme]['color_border']
	},
	emphasis: {
		iconStyle: {
			borderColor: THEME[theme]['color_main']
		}
	}
})
