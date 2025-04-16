import { Modal, Tabs } from 'antd'
import { getLocale } from '@umijs/max'
import clsx from 'clsx'
import styles from './index.less'
import type { ILog, LogItem, LogTabItem } from './types'
import { Icon } from '@/widgets'
import { createContext, useContext, useState } from 'react'
import { FormatDateTime } from '@/utils'
import { useGlobal } from '@/context/app'

interface LogContextType {
	openLog: (id: string) => void
	closeLog: () => void
	visibleLogId: string | null
}

const LogContext = createContext<LogContextType>({
	openLog: () => {},
	closeLog: () => {},
	visibleLogId: null
})

interface LogProviderProps {
	children: React.ReactNode
}

export const LogProvider = ({ children }: LogProviderProps) => {
	const [visibleLogId, setVisibleLogId] = useState<string | null>(null)

	const openLog = (id: string) => setVisibleLogId(id)
	const closeLog = () => setVisibleLogId(null)

	return <LogContext.Provider value={{ openLog, closeLog, visibleLogId }}>{children}</LogContext.Provider>
}

interface LogButtonProps {
	id: string
	children?: React.ReactNode
}

export const LogButton = ({ id, children }: LogButtonProps) => {
	const { openLog } = useContext(LogContext)
	const is_cn = getLocale() === 'zh-CN'

	return (
		<div
			className={clsx(styles.logButton, 'log-button')}
			onClick={() => openLog(id)}
			title={is_cn ? '查看日志' : 'View Logs'}
		>
			{children || <Icon name='material-chevron_right' size={14} />}
		</div>
	)
}

interface IProps {
	id: string
	logs: ILog
	title?: string
	tabItems?: LogTabItem[]
}

const Log = (props: IProps) => {
	const { id, logs, title, tabItems: customTabItems } = props
	const { visibleLogId, closeLog } = useContext(LogContext)
	const is_cn = getLocale() === 'zh-CN'
	const [isMaximized, setIsMaximized] = useState(false)

	const defaultTabItems = [
		{
			key: 'console',
			label: is_cn ? '控制台' : 'Console',
			children: null
		},
		{
			key: 'request',
			label: is_cn ? '请求' : 'Request',
			children: null
		},
		{
			key: 'response',
			label: is_cn ? '响应' : 'Response',
			children: null
		}
	]

	const tabItems = customTabItems || defaultTabItems
	const [activeTab, setActiveTab] = useState(tabItems?.[0]?.key || 'console')

	console.log('_____')
	console.log(visibleLogId, id)
	console.log('_____')

	return (
		<Modal
			title={
				<div className={styles.modalHeader}>
					<div className={styles.headerTitle}>{title || (is_cn ? '日志查看器' : 'Log Viewer')}</div>
					<div className={styles.headerTabs}>
						<Tabs
							items={tabItems}
							className={styles.logTabs}
							activeKey={activeTab}
							onChange={setActiveTab}
						/>
					</div>
					<div className={styles.headerActions}>
						<Icon
							name={isMaximized ? 'material-fullscreen_exit' : 'material-fullscreen'}
							className={styles.actionIcon}
							onClick={() => setIsMaximized(!isMaximized)}
							size={16}
						/>
						<Icon
							name='material-close'
							className={styles.actionIcon}
							onClick={closeLog}
							size={18}
						/>
					</div>
				</div>
			}
			open={visibleLogId === id}
			onCancel={closeLog}
			footer={null}
			className={clsx('custom_modal', styles.logModal, { [styles.maximized]: isMaximized })}
			width={isMaximized ? '100vw' : 800}
			style={isMaximized ? { top: 0, padding: 0, maxWidth: '100vw', margin: 0 } : undefined}
			bodyStyle={{ height: isMaximized ? 'calc(100vh - 55px)' : 'auto', padding: '16px' }}
			destroyOnClose
			wrapClassName={isMaximized ? styles.maximizedWrapper : undefined}
		>
			<div className={styles.logContainer}>
				<div className={styles.logContent}>
					{(() => {
						const logEntries = logs[activeTab]
						return Array.isArray(logEntries) ? (
							logEntries.map((item: LogItem, index: number) => (
								<div key={index} className={clsx(styles.logItem, styles[item.level])}>
									<span className={styles.datetime}>
										{FormatDateTime(new Date(item.datetime), is_cn)}
									</span>
									<span className={styles.levelIcon}>
										{item.level === 'info' && (
											<Icon name='material-info' size={14} />
										)}
										{item.level === 'warn' && (
											<Icon name='material-warning' size={14} />
										)}
										{item.level === 'error' && (
											<Icon name='material-dangerous' size={14} />
										)}
									</span>
									<span className={styles.message}>
										{item.level === 'error' ? (
											<div className={styles.errorMessage}>
												{item.message}
											</div>
										) : (
											<div className={styles.messageContent}>
												{item.message}
											</div>
										)}
									</span>
								</div>
							))
						) : (
							<div className={styles.emptyLog}>
								<Icon name='material-description' size={24} />
								<span>{is_cn ? '暂无日志' : 'No logs available'}</span>
							</div>
						)
					})()}
				</div>
			</div>
		</Modal>
	)
}

export default Log
