import moment from 'moment'

import type { Component } from '@/types'

interface IProps extends Component.PropsViewComponent {
	format?: string
	color?: string
}

const Index = (props: IProps) => {
	const { __value, color } = props

	if (!__value) return <span>-</span>

	const style = color ? { color } : undefined

	if (props?.format) {
		if (Array.isArray(__value)) {
			return (
				<span style={style}>
					<span>{moment(__value[0]).format(props.format)}</span>
					<span className='ml_6 mr_6'>-</span>
					<span>{moment(__value[1]).format(props.format)}</span>
				</span>
			)
		}

		return <span style={style}>{moment(__value).format(props.format)}</span>
	}

	return <span style={style}>{__value}</span>
}

export default window.$app.memo(Index)
