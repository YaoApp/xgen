import { Button, Tooltip } from 'antd'
import Icon from '@/widgets/Icon'
import styles from './index.less'
import { getLocale } from '@umijs/max'

interface HeaderProps {
	title: string
	onNew?: () => void
	onClose?: () => void
	onHistory?: () => void
	onFloat?: () => void
}

const Header = ({ title, onNew, onClose, onHistory, onFloat }: HeaderProps) => {
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'

	return (
		<div className={styles.header}>
			<div className={styles.title}>{title}</div>
			<div className={styles.actions}>
				<Tooltip title={is_cn ? '新建对话' : 'New Chat'} placement='bottom'>
					<Button
						type='text'
						icon={<Icon name='material-add' size={20} />}
						className={styles.actionBtn}
						onClick={onNew}
					/>
				</Tooltip>
				<Tooltip title={is_cn ? '历史记录' : 'History'} placement='bottom'>
					<Button
						type='text'
						icon={<Icon name='material-history' size={18} />}
						className={styles.actionBtn}
						onClick={onHistory}
					/>
				</Tooltip>
				<Tooltip title={is_cn ? '弹出窗口' : 'Pop Out'} placement='bottom'>
					<Button
						type='text'
						icon={<Icon name='material-open_in_new' size={18} />}
						className={styles.actionBtn}
						onClick={onFloat}
					/>
				</Tooltip>
				<Tooltip title={is_cn ? '关闭' : 'Close'} placement='bottom'>
					<Button
						type='text'
						icon={<Icon name='material-close' size={20} />}
						className={styles.actionBtn}
						onClick={onClose}
					/>
				</Tooltip>
			</div>
		</div>
	)
}

export default Header
