import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, PropsWithChildren, useState, useCallback, useEffect } from 'react'
import { container } from 'tsyringe'
import { GlobalModel } from '@/context/app'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import './style.less'

const MAIN_CONTENT_MIN_WIDTH = 560
const DEFAULT_WIDTH = 400

// Get maximum available width for sidebar while maintaining minimum content width
const getMaxWidth = () => {
	return window.innerWidth - MAIN_CONTENT_MIN_WIDTH
}

// Get maximum width for maximized state (full viewport minus button space)
const getMaximizedWidth = () => {
	return window.innerWidth - 40
}

// Get responsive width settings based on screen size
const getResponsiveWidths = () => {
	const screenWidth = window.innerWidth
	if (screenWidth >= 1920) {
		return {
			min: 480,
			max: getMaxWidth(),
			default: 720
		}
	} else if (screenWidth >= 1440) {
		return {
			min: 400,
			max: getMaxWidth(),
			default: 520
		}
	} else {
		return {
			min: 320,
			max: getMaxWidth(),
			default: 400
		}
	}
}

const ChatWrapper: FC<PropsWithChildren> = ({ children }) => {
	const global = container.resolve(GlobalModel)
	const [sidebarVisible, setSidebarVisible] = useState(false)
	const [sidebarWidth, setSidebarWidth] = useState(getResponsiveWidths().default)
	const [isAnimating, setIsAnimating] = useState(false)
	const [responsiveWidths, setResponsiveWidths] = useState(getResponsiveWidths())
	const [isMaximized, setIsMaximized] = useState(false)
	const [previousWidth, setPreviousWidth] = useState(DEFAULT_WIDTH)

	// Listen for window resize events
	useEffect(() => {
		const handleResize = () => {
			const newWidths = getResponsiveWidths()
			setResponsiveWidths(newWidths)
			// Adjust width to nearest valid value if current width is out of range
			if (!isMaximized) {
				setSidebarWidth((prev) => {
					if (prev < newWidths.min) return newWidths.min
					if (prev > newWidths.max) return newWidths.max
					return prev
				})
			} else {
				setSidebarWidth(getMaximizedWidth())
			}
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [isMaximized])

	const handleToggleLayout = () => {
		global.setLayout('Admin')
	}

	const handleToggleSidebar = () => {
		setIsAnimating(true)
		setSidebarVisible(!sidebarVisible)
		setTimeout(() => setIsAnimating(false), 300)
	}

	const handleToggleMaximize = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsAnimating(true)
		if (isMaximized) {
			setSidebarWidth(previousWidth)
		} else {
			setPreviousWidth(sidebarWidth)
			setSidebarWidth(getMaximizedWidth())
		}
		setIsMaximized(!isMaximized)
		setTimeout(() => setIsAnimating(false), 300)
	}

	const handleResizeStart = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (isMaximized) return
			e.preventDefault()

			const startX = e.pageX
			const startWidth = sidebarWidth

			const handleMouseMove = (e: MouseEvent) => {
				const delta = startX - e.pageX
				const newWidth = Math.min(
					Math.max(startWidth + delta, responsiveWidths.min),
					responsiveWidths.max
				)
				setSidebarWidth(newWidth)
			}

			const handleMouseUp = () => {
				document.removeEventListener('mousemove', handleMouseMove)
				document.removeEventListener('mouseup', handleMouseUp)
			}

			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		},
		[sidebarWidth, responsiveWidths, isMaximized]
	)

	return (
		<div
			className={clsx(
				'chat-wrapper',
				sidebarVisible && 'with-sidebar',
				isAnimating && 'animating',
				isMaximized && 'maximized'
			)}
		>
			<div className='chat-header'>
				<Button onClick={handleToggleLayout} style={{ marginRight: 8 }}>
					Switch to Admin
				</Button>
				<Button onClick={handleToggleSidebar}>
					{sidebarVisible ? 'Close Sidebar' : 'Open Sidebar'}
				</Button>
			</div>
			<div
				className='chat-content'
				style={sidebarVisible && !isMaximized ? { width: `calc(100% - ${sidebarWidth}px)` } : undefined}
			>
				{children}
			</div>
			<div
				className={clsx('chat-sidebar', !sidebarVisible && 'hidden', isAnimating && 'animating')}
				style={{
					width: sidebarWidth,
					...(isMaximized ? { position: 'fixed', right: 0 } : undefined)
				}}
			>
				<div className='resize-handle' onMouseDown={handleResizeStart}>
					<Button
						type='text'
						className='maximize-btn'
						onClick={handleToggleMaximize}
						icon={isMaximized ? <RightOutlined /> : <LeftOutlined />}
					/>
				</div>
				<div className='sidebar-content'>Sidebar Content</div>
			</div>
			{isMaximized && sidebarVisible && <div className='sidebar-overlay' onClick={handleToggleMaximize} />}
		</div>
	)
}

export default observer(ChatWrapper)
