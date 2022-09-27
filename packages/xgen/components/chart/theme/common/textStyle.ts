import { THEME } from '@/styles'

import type { App } from '@/types'

export default (theme: App.Theme) => ({
	color: THEME[theme]['color_text']
})
