import { WarningCircle } from 'phosphor-react'
import styles from './index.less'
import type { Component } from '@/types'

interface IProps extends Component.PropsChatComponent {
	id?: string
	text: string
}

const Index = (props: IProps) => {
	const { text } = props

	const cleanErrorMessage = (message: string) => {
		return message.replace(/^Error:\s*/, '').replace(/^Exception\|\d+:\s*/, '')
	}

	return (
		<div className={styles._local}>
			<div className={styles.error_container}>
				<WarningCircle size={20} weight='fill' />
				<span className={styles.error_text}>{cleanErrorMessage(text)}</span>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
