import { observer } from 'mobx-react-lite'
import { Else, If, Then } from 'react-if'

import { useGlobal } from '@/context/app'
import dark_theme from '@/public/theme/dark.sss'
import light_theme from '@/public/theme/light.sss'

const Index = () => {
	const global = useGlobal()

	return (
		<If condition={(global?.theme || window.$global?.theme) === 'dark'}>
			<Then>
				<style>{dark_theme}</style>
			</Then>
			<Else>
				<style>{light_theme}</style>
			</Else>
		</If>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
