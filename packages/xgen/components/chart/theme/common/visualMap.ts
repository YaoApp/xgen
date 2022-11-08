import { THEME } from '@/styles'

import type { App } from '@/types'

export default (theme: App.Theme) => ({
	textStyle: {
		color: THEME[theme]['color_text']
	},
	color: theme === 'light' ? ['#516b91', '#59c4e6', '#a5e7f0'] : ['#4992ff', '#7cffb2', '#58d9f9']
})
