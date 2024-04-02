import { Fragment } from 'react'
import { Else, If, Then } from 'react-if'

import styles_common from './common.lsss'
import styles_no_label from './no_label.lsss'
import styles_show_label from './show_label.lsss'
import styles_builder from './builder.lsss'

interface IProps {
	showLabel: boolean | undefined
	builder?: boolean
}

const Index = (props: IProps) => {
	const { showLabel, builder } = props
	if (builder) {
		return (
			<Fragment>
				<style>{styles_builder}</style>
			</Fragment>
		)
	}

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
