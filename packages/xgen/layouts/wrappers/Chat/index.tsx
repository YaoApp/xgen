import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, PropsWithChildren, useState, useCallback, useEffect } from 'react'
import { container } from 'tsyringe'
import { GlobalModel } from '@/context/app'
import clsx from 'clsx'
import './style.less'

// Responsive width settings based on screen size
const getResponsiveWidths = () => {
	const screenWidth = window.innerWidth
	if (screenWidth >= 1920) {
		return {
			min: 480,
			max: 1200,
			default: 720
		}
	} else if (screenWidth >= 1440) {
		return {
			min: 400,
			max: 960,
			default: 520
		}
	} else {
		return {
			min: 320,
			max: 640,
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

	// Listen for window resize events
	useEffect(() => {
		const handleResize = () => {
			const newWidths = getResponsiveWidths()
			setResponsiveWidths(newWidths)
			// Adjust width to nearest valid value if current width is out of range
			setSidebarWidth((prev) => {
				if (prev < newWidths.min) return newWidths.min
				if (prev > newWidths.max) return newWidths.max
				return prev
			})
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const handleToggleLayout = () => {
		global.setLayout('Admin')
	}

	const handleToggleSidebar = () => {
		setIsAnimating(true)
		setSidebarVisible(!sidebarVisible)
		setTimeout(() => setIsAnimating(false), 300)
	}

	const handleResizeStart = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
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
		[sidebarWidth, responsiveWidths]
	)

	return (
		<div
			className={clsx('chat-wrapper', sidebarVisible && 'with-sidebar', isAnimating && 'animating')}
			style={sidebarVisible ? { paddingRight: sidebarWidth } : undefined}
		>
			<div className='chat-header'>
				<Button onClick={handleToggleLayout} style={{ marginRight: 8 }}>
					Switch to Admin
				</Button>
				<Button onClick={handleToggleSidebar}>
					{sidebarVisible ? 'Close Sidebar' : 'Open Sidebar'}
				</Button>
			</div>
			<div className='chat-content'>{children}</div>
			<div
				className={clsx('chat-sidebar', !sidebarVisible && 'hidden', isAnimating && 'animating')}
				style={{ width: sidebarWidth }}
			>
				<div className='resize-handle' onMouseDown={handleResizeStart} />
				<div className='sidebar-content'>Sidebar Content</div>
			</div>
		</div>
	)
}

export default observer(ChatWrapper)
