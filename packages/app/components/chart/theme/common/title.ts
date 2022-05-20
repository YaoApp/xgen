import { THEME } from '@/styles'

import type { App } from '@/types'

export default (theme: App.Theme) => ({
	textStyle: {
		color: THEME[theme]['color_text']
	},
	subtextStyle: {
		color: THEME[theme]['color_text_grey']
	}
})
