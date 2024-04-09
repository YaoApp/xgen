import { useGlobal } from '@/context/app'
import colors from '@/styles/preset/vars'
import { Icon } from '@/widgets'
import { CSSProperties } from 'react'

interface IProps {
	icon?: string | { name: string; size?: number }
	color?: string
	weight?: number | string
	text: string
	styles?: CSSProperties
}

const Index = (props: IProps) => {
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

	const styles = props.styles ? props.styles : {}
	styles['color'] = props.color ? getColor(props.color) : undefined
	styles['fontWeight'] = props.weight ? getWeight(props.weight) : undefined
	if (props.icon) {
		const size = typeof props.icon === 'string' ? 14 : props.icon.size || 14
		styles['marginLeft'] = 4
		return (
			<div className='flex align_center' style={styles}>
				<Icon name={typeof props.icon === 'string' ? props.icon : props.icon.name} size={size}></Icon>
				<span style={styles}>{props.text}</span>
			</div>
		)
	}
	return <span style={styles}>{props.text}</span>
}

export default window.$app.memo(Index)
