import { useAction } from '@/actions'
import clsx from 'clsx'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import type { Action } from '@/types'
import type { Component } from '@/types'
import Text from '../text'

interface IProps extends Component.PropsChatComponent {
	title: string
	text?: string
	actions: Array<ButtonProps>
}

type ButtonProps = {
	title: string
	icon?: string
	style?: 'danger' | 'success' | 'primary' | 'default'
	namespace: string
	primary: string
	action: Array<Action.ActionParams>
	data_item?: any
	extra?: any
}

const Index = (props: IProps) => {
	const { assistant_id, chat_id, title, text, actions } = props
	const onAction = useAction()

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
				{text && <Text assistant_id={assistant_id} chat_id={chat_id} text={text} />}
			</div>
			<div className={styles.actions}>
				{actions &&
					actions.length > 0 &&
					actions.map((action: ButtonProps, index: number) => (
						<button
							key={index}
							className={clsx(styles.button, styles[action.style || 'default'])}
							onClick={() => runAction(action)}
						>
							{action.icon && <Icon name={action.icon} size={16} />}
							<span>{action.title || 'Cancel'}</span>
						</button>
					))}
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
