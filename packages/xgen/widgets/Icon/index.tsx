/**
 * Icon Component
 * feather icon https://feathericons.com/  icon-*
 * material symbols https://fonts.google.com/icons?icon.set=Material+Symbols material-*
 * material icons https://fonts.google.com/icons?icon.set=Material+Icons  *-outline *-filled
 */

import { useGlobal } from '@/context/app'
import { Color } from '@/utils'
import clsx from 'clsx'
import { useMemo } from 'react'

interface IProps {
	/** 图表样式类 */
	className?: string
	/** 图标名称，以`icon`开头为feather icon，以`outline/filled`结尾为material design icon */
	name: string
	/** 图标尺寸，单位px */
	size?: number
	/** 图标颜色，适用所有字体颜色 */
	color?: string

	style?: React.CSSProperties

	/** 点击事件 */
	onClick?: () => void
}

const Index = (props: IProps) => {
	const { className = '', name = '', size = '24', color = '', onClick } = props
	const global = useGlobal()
	if (!name) return null

	const style: React.CSSProperties = useMemo(() => {
		return {
			fontSize: size + 'px',
			color: color != '' ? Color(color, global.theme) : ''
		}
	}, [size, color])

	const md = useMemo(() => {
		if (!name) return {}
		// material_symbols https://fonts.google.com/icons
		if (name.indexOf('material-') !== -1) {
			return { type: 'material', name: name.replace(/^material-/, '') }
		}
		const arr = name.split('-')
		const type = arr.pop()
		return {
			type,
			name: arr.join('_')
		}
	}, [name])

	if (name.indexOf('icon-') !== -1) {
		return <i className={clsx([name, className])} style={{ ...style, ...props.style }} onClick={onClick}></i>
	}

	return (
		<i className={clsx(['Icon', md.type, className])} style={{ ...style, ...props.style }} onClick={onClick}>
			{md.name}
		</i>
	)
}

export default window.$app.memo(Index)
