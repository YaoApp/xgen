import { getLocale } from '@umijs/max'
import { useEffect, useState } from 'react'
import Loading from '../loading'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import type { Component } from '@/types'

interface IProps extends Component.PropsChatComponent {
	id?: string
	begin?: number
	end?: number
	text?: string
	chat_id: string
	pending?: boolean
	children?: React.ReactNode
}

const Index = (props: IProps) => {
	const { chat_id, pending, text, children } = props
	const is_cn = getLocale() === 'zh-CN'
	const [isCollapsed, setIsCollapsed] = useState(pending ? false : true)

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed)
	}

	const content = children || text || (is_cn ? '思考中...' : 'Thinking...')
	const title = pending ? (is_cn ? '思考中...' : 'Thinking...') : is_cn ? '思考' : 'Think'
	return (
		<div>
			<div className={styles.header}>
				<span className={styles.toggle} onClick={toggleCollapse}>
					<Icon name='material-psychology_alt' size={16} />
					<span>{title}</span>
					<Icon name={isCollapsed ? 'material-chevron_right' : 'material-expand_more'} size={16} />
				</span>
			</div>
			<div className={`${styles.think} ${isCollapsed ? styles.collapsed : ''}`}>{content}</div>
		</div>
	)
}

export default window.$app.memo(Index)
