import clsx from 'clsx'
import { Icon } from '@/widgets'
import styles from './index.less'
import type { Component } from '@/types'
import Text from '../text'

interface IProps extends Component.PropsChatComponent {
	id: string
	title: string
	description?: string
	text?: string
	tasks: {
		id: string
		title: string
		status: ITaskStatus
		order: number
	}[]
}

type ITaskStatus = 'created' | 'running' | 'completed' | 'failed' | 'destroyed' | 'cancelled'

const Plan = (props: IProps) => {
	const { title, description, tasks, assistant_id, chat_id } = props

	// Sort tasks by order
	const sortedTasks = [...tasks].sort((a, b) => a.order - b.order)

	return (
		<div className={styles.plan}>
			<div className={styles.header}>
				<div className={styles.progress}>
					<span className={styles.icon}>
						<Icon name='material-slow_motion_video' size={16} />
					</span>
					<span>{title}</span>
				</div>
			</div>

			<div className={styles.content_wrapper}>
				{description && (
					<div className={styles.description}>
						<Text assistant_id={assistant_id} chat_id={chat_id} text={description} />
					</div>
				)}

				<div className={styles.tasks}>
					{sortedTasks.map((task) => (
						<div key={task.id} className={styles.task}>
							<div className={clsx(styles.status, styles[task.status])} />
							<div className={styles.content}>
								<div className={styles.title}>{task.title}</div>
								<div className={styles.order}>#{task.order}</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Plan
