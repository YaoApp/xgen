import Loading from '../loading'
import styles from './index.less'
import type { Component } from '@/types'

interface IProps extends Component.PropsChatComponent {
	text: string
	chat_id: string
	done?: boolean
}

const Index = (props: IProps) => {
	const { text, chat_id, done } = props
	return (
		<div>
			{!done && <Loading chat_id={chat_id} placeholder={'Thinking'} icon='material-psychology_alt' />}
			<div className={styles.think}>
				<span>{text}</span>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
