import AIChat from '../components/AIChat'
import styles from './index.less'
import type { IPropsNeo } from '../../../types'
import { useState } from 'react'
import { mockMessages } from '../Sidebar/mock'

const Index = (props: IPropsNeo) => {
	return (
		<div className={styles.container}>
			<AIChat
				className={styles.aiChat}
				title='AI Assistant'
				headerButtons={['new', 'history']}
				currentPage={'chat/index'}
				onNew={() => {
					/* handle new */
				}}
				onClose={() => {
					/* handle close */
				}}
			/>
		</div>
	)
}

export default Index
