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
	color: COLORS['light'],
	tooltip: tooltip('light'),
	legend: legend('light'),
	textStyle: textStyle('light'),
	title: title('light'),
	toolbox: toolbox('light'),
	visualMap: visualMap('dark')
}
