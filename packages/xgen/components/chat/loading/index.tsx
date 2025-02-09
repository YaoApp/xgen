import { useEffect, useState } from 'react'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import type { Component } from '@/types'

interface IProps extends Component.PropsChatComponent {
	placeholder?: string
	icon?: string
}

const Index = (props: IProps) => {
	const { placeholder, icon } = props
	const [dots, setDots] = useState('')

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => {
				if (prev.length >= 3) return ''
				return prev + '.'
			})
		}, 500)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className={styles.loading}>
			{icon && (
				<span className={styles.icon}>
					<Icon name={icon} size={16} />
				</span>
			)}
			{placeholder && <span className={styles.placeholder}>{placeholder}</span>}
			<span className={styles.dots}>
				{dots}
				<span style={{ opacity: 0 }}>...</span>
			</span>
		</div>
	)
}

export default window.$app.memo(Index)
