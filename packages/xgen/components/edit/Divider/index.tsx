import clsx from 'clsx'
import styles from './index.less'
import { useGlobal } from '@/context/app'
import colors from '@/styles/preset/vars'
import { CSSProperties } from 'react'

interface IProps {
	color?: string
	size?: number
	height?: number
	title?: string
	desc?: string
	width?: number
	titleColor?: string
	titleSize?: number
}
const Index = (props: IProps) => {
	const global = useGlobal()
	const theme = global.theme

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

	const getColor = (color: string | undefined) => {
		if (!color) return color
		return presetColors[color] || color
	}

	const lineStyles: CSSProperties = {}
	const titleStyles: CSSProperties = {}
	const wrapStyles: CSSProperties = {}
	wrapStyles['height'] = props.height ? props.height : undefined
	lineStyles['backgroundColor'] = props.color ? getColor(props.color) : undefined
	titleStyles['backgroundColor'] = props.color ? getColor(props.color) : undefined
	titleStyles['color'] = props.titleColor ? getColor(props.titleColor) : '#ffffff'
	titleStyles['fontSize'] = props.titleSize ? props.titleSize : undefined
	lineStyles['width'] = props.width ? props.width : '100%'
	lineStyles['height'] = props.size ? props.size : 1

	return (
		<div className={clsx([styles._local, 'w_100 border_box flex flex_column'])}>
			<div className='wrap flex flex_column disabled' style={wrapStyles}>
				<div className='flex align_center'>
					{props.title && props.title != '' && (
						<span className={clsx(['title', 'with_line'])} style={titleStyles}>
							<div>{props.title}</div>
						</span>
					)}
					<span className='divide_line' style={lineStyles}></span>
				</div>
				{props.desc && <span className='desc'>{props.desc}</span>}
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
