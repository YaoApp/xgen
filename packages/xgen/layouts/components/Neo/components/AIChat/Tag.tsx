import { FC } from 'react'
import styles from './Tag.less'

interface Props {
	/** Tag text content */
	children: React.ReactNode
	/** Tag color variant */
	variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

const Tag: FC<Props> = ({ children, variant = 'primary' }) => {
	return <span className={`${styles.tag} ${styles[variant]}`}>{children}</span>
}

export default Tag
