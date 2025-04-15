import { Modal, Tabs } from 'antd'
import { getLocale } from '@umijs/max'
import clsx from 'clsx'
import styles from './index.less'
import type { Component } from '@/types'
import type { ILog, Log } from './types'
import { Icon } from '@/widgets'
import { createContext, useContext, useState } from 'react'

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
	logs: ILog[]
}

const Log = (props: IProps) => {
	const { id, logs } = props
	const { visibleLogId, closeLog } = useContext(LogContext)
	const is_cn = getLocale() === 'zh-CN'
	const [isMaximized, setIsMaximized] = useState(false)

	const tabItems = [
		{
			key: 'console',
			label: is_cn ? '控制台' : 'Console',
			children: (
				<div className={styles.logContent}>
					{logs
						.find((log) => log.id === id)
						?.console.map((item: Log, index: number) => (
							<div key={index} className={styles.logItem}>
								<span className={styles.datetime}>
									{new Date(item.datetime).toLocaleString()}
								</span>
								<span className={styles.message}>{item.message}</span>
							</div>
						))}
				</div>
			)
		},
		{
			key: 'request',
			label: is_cn ? '请求' : 'Request',
			children: (
				<div className={styles.logContent}>
					{logs
						.find((log) => log.id === id)
						?.request.map((item: Log, index: number) => (
							<div key={index} className={styles.logItem}>
								<span className={styles.datetime}>
									{new Date(item.datetime).toLocaleString()}
								</span>
								<span className={styles.message}>{item.message}</span>
							</div>
						))}
				</div>
			)
		},
		{
			key: 'response',
			label: is_cn ? '响应' : 'Response',
			children: (
				<div className={styles.logContent}>
					{logs
						.find((log) => log.id === id)
						?.response.map((item: Log, index: number) => (
							<div key={index} className={styles.logItem}>
								<span className={styles.datetime}>
									{new Date(item.datetime).toLocaleString()}
								</span>
								<span className={styles.message}>{item.message}</span>
							</div>
						))}
				</div>
			)
		}
	]

	return (
		<Modal
			title={
				<div className={styles.modalHeader}>
					<span>{is_cn ? '日志查看器' : 'Log Viewer'}</span>
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
				<Tabs items={tabItems} className={styles.logTabs} />
			</div>
		</Modal>
	)
}

export default Log
