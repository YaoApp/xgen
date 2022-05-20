import { COLORS } from '@/styles'

import base from './base'
import legend from './common/legend'
import textStyle from './common/textStyle'
import title from './common/title'
import toolbox from './common/toolbox'
import tooltip from './common/tooltip'
import visualMap from './common/visualMap'

export default {
	...base,
	darkMode: true,
	color: COLORS['dark'],
	tooltip: tooltip('dark'),
	legend: legend('dark'),
	textStyle: textStyle('dark'),
	title: title('dark'),
	toolbox: toolbox('dark'),
	visualMap: visualMap('dark')
}
