import Icon from '@/widgets/Icon'
import styles from './index.less'
import clsx from 'clsx'
import { App } from '@/types'
import { useGlobal } from '@/context/app'

interface AssistantProps {
	assistant: App.AssistantSummary | undefined
	loading?: boolean
	onDelete?: () => void
}

const Assistant = ({ assistant, loading, onDelete }: AssistantProps) => {
	const { assistant_name, assistant_avatar, assistant_deleteable } = assistant || {}
	if (loading) {
		return (
			<div className={styles.assistantInfo}>
				<div className={styles.avatarWrapper}>
					<div className={styles.loadingAvatar} />
					<div className={styles.loadingName} />
				</div>
			</div>
		)
	}

	return (
		<div className={styles.assistantInfo}>
			<div className={styles.avatarWrapper}>
				<img
					src={assistant_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${assistant_name}`}
					alt='Assistant'
					className={styles.avatar}
				/>
				<div className={styles.assistantName} title={assistant_name}>
					{assistant_name}
				</div>
			</div>
			{(assistant_deleteable || assistant_deleteable === undefined) && (
				<div
					className={clsx(styles.deleteBtn, { [styles.disabled]: loading })}
					onClick={!loading ? onDelete : undefined}
				>
					<Icon name='material-close' size={12} />
				</div>
			)}
		</div>
	)
}

export default Assistant
