import { getLocale } from '@umijs/max'
import React from 'react'
import { Icon } from '@/widgets'
import styles from './index.less'
import type { Component } from '@/types'

interface IProps extends Component.PropsChatComponent {
	id?: string
	assistant_id?: string
	text?: string
	title?: string
	done?: boolean
	begin?: number
	end?: number
	status?: 'generating' | 'done' | 'failed' | 'running'
}

const Progress = (props: IProps) => {
	const { id, title, done = false, begin, end } = props
	const is_cn = getLocale() === 'zh-CN'

	if (!id) return null

	const innerContent = (
		<div className={done ? styles.progress_done : styles.progress}>
			<span className={styles.icon}>
				<Icon name='material-slow_motion_video' size={16} />
			</span>
			<span>{title || (is_cn ? '正在生成回复...' : 'Generating response...')}</span>
		</div>
	)

	return (
		<div onClick={!done ? undefined : () => {}} style={{ cursor: !done ? 'default' : 'pointer' }}>
			{innerContent}
		</div>
	)
}

export default window.$app.memo(Progress)
