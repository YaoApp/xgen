import Icon from '@/widgets/Icon'
import styles from './index.less'
import clsx from 'clsx'

interface AssistantProps {
	assistant: {
		assistant_id: string
		assistant_name: string
		assistant_avatar?: string
		canDelete?: boolean
	}
	loading?: boolean
	onDelete?: () => void
}

const Assistant = ({ assistant, loading, onDelete }: AssistantProps) => {
	const { assistant_name, assistant_avatar } = assistant

	return (
		<div className={styles.assistantInfo}>
			<div className={styles.avatarWrapper}>
				<img
					src={assistant_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${assistant_name}`}
					alt='Assistant'
					className={styles.avatar}
				/>
				<div className={styles.assistantName}>{assistant_name}</div>
			</div>
			{assistant.canDelete ||
				(assistant.canDelete === undefined && (
					<div
						className={clsx(styles.deleteBtn, { [styles.disabled]: loading })}
						onClick={!loading ? onDelete : undefined}
					>
						<Icon name='material-close' size={12} />
					</div>
				))}
		</div>
	)
}

export default Assistant
