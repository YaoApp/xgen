import { Fragment } from 'react'
import { Else, If, Then } from 'react-if'

import styles_common from './common.lsss'
import styles_no_label from './no_label.lsss'
import styles_show_label from './show_label.lsss'

interface IProps {
	showLabel: boolean | undefined
}

const Index = (props: IProps) => {
	const { showLabel } = props

	return (
		<Fragment>
			<style>{styles_common}</style>
			<If condition={showLabel}>
				<Then>
					<style>{styles_show_label}</style>
				</Then>
				<Else>
					<style>{styles_no_label}</style>
				</Else>
			</If>
		</Fragment>
	)
}

export default window.$app.memo(Index)
