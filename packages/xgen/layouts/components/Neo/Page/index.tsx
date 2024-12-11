import AIChat from '../components/AIChat'
import styles from './index.less'
import type { IPropsNeo } from '../../../types'

const Index = (props: IPropsNeo) => {
	const handleSend = (message: string, files?: any[]) => {
		console.log('Send message:', message, files)
	}

	return (
		<div className={styles.container}>
			<AIChat onSend={handleSend} className={styles.chat} />
		</div>
	)
}

export default Index
