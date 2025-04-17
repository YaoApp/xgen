import { useEffect, useState } from 'react'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import type { Component } from '@/types'
import Loading from '@/widgets/Loading'

interface IProps extends Component.PropsChatComponent {
	placeholder?: string
	icon?: string
}

const Index = (props: IProps) => {
	const { placeholder, icon } = props

	return (
		<div className={styles.loading}>
			{icon && (
				<span className={styles.icon}>
					<Icon name={icon} size={16} />
				</span>
			)}
			{placeholder && <span className={styles.placeholder}>{placeholder}</span>}
			<Loading size={16} />
		</div>
	)
}

export default window.$app.memo(Index)
