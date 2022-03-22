import { useTitle } from 'ahooks'
import { Tooltip } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'

import { Icon } from '@/components'
import { useGlobal } from '@/context/app'

import Left from './components/Left'
import styles from './index.less'

import type { IProps, IPropsLeft, IPropsActions } from './types'

const Index = (props: IProps) => {
	const { children, className, style, options = [], isChart } = props
	const global = useGlobal()
	const menu = global.menu.slice()
	const visible_menu = global.visible_menu
	const visible_header = global.visible_header
	const title = menu[global.current_nav]?.children?.[global.current_menu]?.name || ''

      console.log(global.current_menu);
	console.log(title)

	useTitle(`${global.app_info.name} - ${menu[global.current_nav]?.name} - ${title}`)

	const onAction = useCallback((type, payload) => {}, [])

	const props_left: IPropsLeft = {
		visible_menu,
		title,
		toggleMenu: global.toggleMenu
	}

	return (
		<div
			className={clsx([styles._local, className, isChart ? styles.chart : ''])}
			style={style}
		>
			<header
				className={clsx(
					'header w_100 border_box flex justify_between align_center',
					!visible_header ? 'invisible' : ''
				)}
			>
				<Left {...props_left}></Left>
				<div className='options_wrap flex align_center'>
					{Array.isArray(options)
						? !!options.length &&
						  options.map((item, index) => (
								<Tooltip
									title={item.title}
									placement='bottom'
									key={index}
								>
									<a
										className='option_item cursor_point flex justify_center align_center transition_normal clickable'
										onClick={() => {
											if (item.action) {
												onAction(
													item.action,
													item.payload
												)
											}

											if (item.onClick) {
												item.onClick()
											}
										}}
									>
										<Icon
											className='icon_option'
											name={item.icon}
											size={18}
										></Icon>
									</a>
								</Tooltip>
						  ))
						: options}
				</div>
			</header>
			<div className='page_wrap'>{children}</div>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
