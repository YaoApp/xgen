import { useAction } from '@/actions'
import clsx from 'clsx'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import type { Action } from '@/types'
import type { Component } from '@/types'

interface IProps extends Component.PropsChatComponent {
	title: string
	description?: string
	confirm: ButtonProps
	cancel?: ButtonProps
}

type ButtonProps = {
	title?: string
	icon?: string
	namespace: string
	primary: string
	action: Array<Action.ActionParams>
	data_item?: any
	extra?: any
}

const Index = (props: IProps) => {
	const { assistant_id, chat_id, title, description, cancel, confirm } = props
	const onAction = useAction()

	console.log('confirm', props)

	// Run action with namespace, primary, data_item, extra
	const runAction = (button: ButtonProps) => {
		try {
			onAction({
				namespace: button.namespace,
				primary: button.primary,
				data_item: button.data_item,
				it: { action: button.action, title: button.title || '', icon: button.icon || '' },
				extra: button.extra
			})
		} catch (err) {
			console.error('Failed to run action:', err)
		}
	}

	return (
		<div className={styles.confirm}>
			<div className={styles.header}>
				<div className={styles.title}>{title}</div>
				{description && <div className={styles.description}>{description}</div>}
			</div>
			<div className={styles.actions}>
				{cancel && (
					<button className={clsx(styles.button, styles.cancel)} onClick={() => runAction(cancel)}>
						{cancel.icon && <Icon name={cancel.icon} size={16} />}
						<span>{cancel.title || 'Cancel'}</span>
					</button>
				)}
				<button className={clsx(styles.button, styles.confirm)} onClick={() => runAction(confirm)}>
					{confirm.icon && <Icon name={confirm.icon} size={16} />}
					<span>{confirm.title || 'Confirm'}</span>
				</button>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
