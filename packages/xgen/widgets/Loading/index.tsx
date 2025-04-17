import { useGlobal } from '@/context/app'
import { Color } from '@/utils'
import clsx from 'clsx'
import { useMemo } from 'react'

interface IProps {
	/** 样式类 */
	className?: string
	/** 尺寸，单位px */
	size?: number
	/** 颜色，适用所有字体颜色 */
	color?: string
	/** 自定义样式 */
	style?: React.CSSProperties
	/** 点击事件 */
	onClick?: () => void
}

const Index = (props: IProps) => {
	const { className = '', size = 24, color = '', onClick } = props
	const global = useGlobal()

	const style: React.CSSProperties = useMemo(() => {
		return {
			fontSize: size + 'px',
			color: color ? Color(color, global.theme) : '',
			display: 'inline-flex',
			alignItems: 'center',
			gap: '3px',
			height: size + 'px',
			...props.style
		}
	}, [size, color, props.style])

	return (
		<div className={clsx('Loading', className)} style={style} onClick={onClick}>
			<style>{`
				@keyframes loadingDot {
					0%, 100% { transform: scale(1); opacity: 0.3; }
					40% { transform: scale(1.2); opacity: 1; }
					80% { transform: scale(1); opacity: 0.3; }
				}
				.Loading > span {
					width: ${Math.max(3, size / 8)}px;
					height: ${Math.max(3, size / 8)}px;
					background-color: currentColor;
					border-radius: 50%;
					display: inline-block;
					animation: loadingDot 1.5s infinite cubic-bezier(0.6, 0.2, 0.4, 0.8);
				}
				.Loading > span:nth-child(1) { animation-delay: 0s; }
				.Loading > span:nth-child(2) { animation-delay: 0.5s; }
				.Loading > span:nth-child(3) { animation-delay: 1s; }
			`}</style>
			<span></span>
			<span></span>
			<span></span>
		</div>
	)
}

export default window.$app.memo(Index)
