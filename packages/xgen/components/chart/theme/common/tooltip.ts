import { THEME } from '@/styles'

import type { App } from '@/types'

export default (theme: App.Theme) => ({
	textStyle: {
		color: THEME[theme]['color_text'],
		fontSize: 12
	},
	backgroundColor: THEME[theme]['color_bg_nav'],
	borderRadius: 6
})
