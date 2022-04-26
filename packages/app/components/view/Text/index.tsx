import moment from 'moment'

import type { Component } from '@/types'

interface IProps extends Component.PropsViewComponent {
	format?: string
}

const Index = (props: IProps) => {
	const { __value } = props

	if (props?.format) {
		return <span>{moment(__value).format(props.format)}</span>
	}

	return <span>{__value}</span>
}

export default window.$app.memo(Index)
