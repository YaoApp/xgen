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
