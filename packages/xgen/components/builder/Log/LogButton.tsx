import { getLocale } from '@umijs/max'
import clsx from 'clsx'
import { Icon } from '@/widgets'
import styles from './index.less'

interface LogButtonProps {
	id: string
	children?: React.ReactNode
	onClick?: (id: string) => void
}

export const LogButton = ({ id, children, onClick }: LogButtonProps) => {
	const is_cn = getLocale() === 'zh-CN'

	return (
		<div
			className={clsx(styles.logButton, 'log-button')}
			onClick={() => onClick?.(id)}
			title={is_cn ? '查看日志' : 'View Logs'}
		>
			{children || <Icon name='material-chevron_right' size={14} />}
		</div>
	)
}

export default LogButton
