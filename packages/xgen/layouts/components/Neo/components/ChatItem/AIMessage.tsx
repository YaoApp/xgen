import { useMemoizedFn } from 'ahooks'
import { NeoContent } from '@/widgets'
import { useAction } from '@/actions'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import type { App } from '@/types'

interface AIMessageProps {
	chat_info: App.ChatAI
	context: App.Context
	callback?: () => void
}

const AIMessage = ({ chat_info, context, callback }: AIMessageProps) => {
	const { text, type, actions } = chat_info
	const onAction = useAction()

	const onExecActions = useMemoizedFn(() => {
		onAction({ ...context, it: { title: '', icon: '', action: actions! } })
	})

	return (
		<div className={styles.content}>
			<div className={styles.avatar}>
				<Icon name='material-robot_2' color='primary' />
			</div>
			<div className={`border_box flex ${styles.left_content}`}>
				<div className='chat_content border_box'>
					<NeoContent source={text} type={type} callback={callback} />
				</div>
			</div>
		</div>
	)
}

export default window.$app.memo(AIMessage)
