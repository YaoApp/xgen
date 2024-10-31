import { useState } from 'react'
import { Else, If, Then } from 'react-if'
import { container } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import dark_theme from '@/public/theme/dark.sss'
import light_theme from '@/public/theme/light.sss'

const Index = () => {
	const [global] = useState(() => container.resolve(GlobalModel))

	return (
		<If condition={(global?.theme || window.$global?.theme) === 'dark'}>
			<Then>
				<style id='xgen-theme'>{dark_theme}</style>
			</Then>
			<Else>
				<style id='xgen-theme'>{light_theme}</style>
			</Else>
		</If>
	)
}

export default window.$app.memo(Index)
