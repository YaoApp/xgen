import { useTitle } from 'ahooks'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import { useGlobal } from '@/context/app'

import Action from './components/Action'
import Left from './components/Left'
import styles from './index.less'

import type { IProps, IPropsLeft } from './types'

const Index = (props: IProps) => {
	const { children, className, style, actions = [], isChart } = props
	const global = useGlobal()
	const menu = global.menu.slice()
	const visible_menu = global.visible_menu
	const visible_header = global.visible_header
	const title = menu[global.current_nav]?.children?.[global.current_menu]?.name || ''

	useTitle(`${global.app_info.name} - ${menu[global.current_nav]?.name} - ${title}`)

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
					{actions?.map((item, index) => (
						<Action {...item} key={index}></Action>
					))}
				</div>
			</header>
			<div className='page_wrap'>{children}</div>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
