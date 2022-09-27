import { THEME } from '@/styles'

import type { App } from '@/types'

export default (theme: App.Theme) => ({
	orient: 'vertical',
	left: 'left',
	top: 'middle',
	itemWidth: 15,
	itemHeight: 9,
	textStyle: {
		color: THEME[theme]['color_text'],
		fontSize: 12
	}
})
