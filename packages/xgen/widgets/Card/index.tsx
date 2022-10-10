import clsx from 'clsx'

import styles from './index.less'

import type { CSSProperties } from 'react'

interface IProps {
	children: React.ReactNode
	className?: string
	title?: string
	options?: React.ReactNode
	width?: string | number
	height?: string | number
	style?: CSSProperties
}

const Index = (props: IProps) => {
      const { children, className, title, options, width, height, style } = props
      
	return (
		<div
			className={clsx([styles._local, className, 'card_wrap'])}
			style={{ width, height }}
		>
			{title && (
				<div className='card_title_wrap w_100 border_box flex justify_between align_center'>
					<span className='card_title'>{title}</span>
					<div className='options_wrap'>{options}</div>
				</div>
			)}
			<div className='card_content_wrap w_100' style={{ ...style }}>
				{children}
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
