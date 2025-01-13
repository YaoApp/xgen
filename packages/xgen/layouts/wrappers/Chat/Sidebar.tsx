import { FC, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'

interface SidebarProps {
	isOpen: boolean
	onClose: () => void
	children?: React.ReactNode
}

const MIN_WIDTH = 320
const MAX_WIDTH = 800
const DEFAULT_WIDTH = 400

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose, children }) => {
	const [width, setWidth] = useState(DEFAULT_WIDTH)
	const sidebarRef = useRef<HTMLDivElement>(null)
	const resizeRef = useRef<HTMLDivElement>(null)
	const isDraggingRef = useRef(false)
	const startXRef = useRef(0)
	const startWidthRef = useRef(0)

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDraggingRef.current) return

			const deltaX = e.clientX - startXRef.current
			const newWidth = startWidthRef.current - deltaX

			if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
				setWidth(newWidth)
			}
		}

		const handleMouseUp = () => {
			isDraggingRef.current = false
			document.body.style.cursor = ''
		}

		if (isDraggingRef.current) {
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [])

	const handleResizeStart = (e: React.MouseEvent) => {
		e.preventDefault()
		isDraggingRef.current = true
		startXRef.current = e.clientX
		startWidthRef.current = width
	}

	if (!isOpen) return null

	return (
		<div
			ref={sidebarRef}
			className='chat-sidebar'
			style={{
				width: width
			}}
		>
			<div ref={resizeRef} className='resize-handle' onMouseDown={handleResizeStart} />
			<div className='sidebar-content'>{children}</div>
		</div>
	)
}

export default observer(Sidebar)
