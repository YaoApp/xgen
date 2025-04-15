import { isPlainObject } from 'lodash-es'
import moment from 'moment'
import { useMemo } from 'react'

import type { Component } from '@/types'
import colors from '@/styles/preset/vars'
import { useGlobal } from '@/context/app'

type Value = string | number | Array<string | number>
type StyledValue = { value: Value; color: string }

interface IProps extends Component.PropsViewComponent {
	__value: Value | StyledValue
	weight?:
		| 'thin'
		| 'extralight'
		| 'light'
		| 'normal'
		| 'medium'
		| 'semibold'
		| 'bold'
		| 'extrabold'
		| 'black'
		| number

	color?: string
	format?: string
	size?: number
}

const Index = (props: IProps) => {
	const { __value } = props
	if (!__value) return <span>-</span>

	const global = useGlobal()
	const theme = global.theme
	const fontWeights: Record<string, number> = {
		thin: 100,
		extralight: 200,
		light: 300,
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
		extrabold: 800,
		black: 900
	}

	const presetColors: Record<string, string> = {
		primary: theme === 'dark' ? colors.dark.color_main : colors.light.color_main,
		warning: theme === 'dark' ? colors.dark.color_warning : colors.light.color_warning,
		success: theme === 'dark' ? colors.dark.color_success : colors.light.color_success,
		danger: theme === 'dark' ? colors.dark.color_danger : colors.light.color_danger,
		text: theme === 'dark' ? colors.dark.color_text : colors.light.color_text,
		grey: theme === 'dark' ? colors.dark.color_text_grey : colors.light.color_text_grey,
		gray: theme === 'dark' ? colors.dark.color_text_grey : colors.light.color_text_grey,
		title: theme === 'dark' ? colors.dark.color_title : colors.light.color_title
	}

	const getWeight = (weight: string | number) => {
		if (typeof weight === 'string') {
			return fontWeights[weight]
		}
		return weight
	}

	const getColor = (color: string | undefined) => {
		if (!color) return color
		return presetColors[color] || color
	}

	const { value, style } = useMemo(() => {
		if (isPlainObject(__value)) {
			const styled_value = __value as StyledValue
			return {
				value: styled_value?.value,
				style: {
					color: styled_value?.color ? styled_value.color : getColor(props.color),
					fontWeight: props?.weight ? getWeight(props.weight) : undefined
				}
			}
		} else {
			return {
				value: __value as Value,
				style: {
					fontWeight: props?.weight ? getWeight(props.weight) : undefined,
					color: getColor(props.color),
					fontSize: props.size ? props.size : undefined
				}
			}
		}
	}, [__value])

	if (props?.format) {
		const formatTime = (val: string | number): string => {
			// Handle number type (potential timestamp)
			if (typeof val === 'number') {
				// If it's a decimal number or too small to be a timestamp, return as is
				if (!Number.isInteger(val) || val < 1) {
					return val.toString()
				}

				try {
					// For Unix timestamps (seconds)
					if (val < 10000000000) {
						const m = moment.unix(val)
						if (m.isValid()) {
							return m.format(props.format)
						}
					}
					// For millisecond timestamps
					else {
						const m = moment(val)
						if (m.isValid()) {
							return m.format(props.format)
						}
					}
				} catch {
					// If any error occurs during parsing, return original value
					return val.toString()
				}
				return val.toString()
			}

			// Handle string type
			if (typeof val === 'string') {
				try {
					const m = moment(val, moment.ISO_8601)
					if (m.isValid()) {
						return m.format(props.format)
					}
				} catch {
					// If parsing fails, return original value
					return val
				}
				return val
			}

			// For any other type, return as string
			return String(val)
		}

		if (Array.isArray(value)) {
			return (
				<span style={style}>
					<span>{formatTime(value[0])}</span>
					<span className='ml_6 mr_6'>-</span>
					<span>{formatTime(value[1])}</span>
				</span>
			)
		}

		return <span style={style}>{formatTime(value)}</span>
	}

	return <span style={style}>{value}</span>
}

export default window.$app.memo(Index)
