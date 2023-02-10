import { isPlainObject } from 'lodash-es'
import moment from 'moment'
import { useMemo } from 'react'

import type { Component } from '@/types'

type Value = string | number | Array<string | number>
type StyledValue = { value: Value; color: string }

interface IProps extends Component.PropsViewComponent {
	__value: Value | StyledValue
	format?: string
}

const Index = (props: IProps) => {
	const { __value } = props

	if (!__value) return <span>-</span>

	const { value, style } = useMemo(() => {
		if (isPlainObject(__value)) {
			const styled_value = __value as StyledValue

			return {
				value: styled_value?.value,
				style: styled_value?.color ? { color: styled_value.color } : undefined
			}
		} else {
			return { value: __value as Value }
		}
	}, [__value])

	if (props?.format) {
		if (Array.isArray(value)) {
			return (
				<span style={style}>
					<span>{moment(value[0]).format(props.format)}</span>
					<span className='ml_6 mr_6'>-</span>
					<span>{moment(value[1]).format(props.format)}</span>
				</span>
			)
		}

		return <span style={style}>{moment(value).format(props.format)}</span>
	}

	return <span style={style}>{value}</span>
}

export default window.$app.memo(Index)
