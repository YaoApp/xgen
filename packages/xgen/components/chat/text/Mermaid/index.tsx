import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { getLocale } from '@umijs/max'
import styles from './index.less'

// Initialize mermaid with better configuration for CJK characters
mermaid.initialize({
	startOnLoad: false,
	theme: 'default',
	securityLevel: 'loose',
	fontSize: 12,

	flowchart: {
		useMaxWidth: true,
		htmlLabels: true,
		curve: 'basis',
		defaultRenderer: 'dagre-d3',
		nodeSpacing: 50,
		rankSpacing: 50,
		padding: 15
	},

	sequence: {
		useMaxWidth: true,
		showSequenceNumbers: false,
		wrap: true,
		width: 150,
		height: 65,
		messageAlign: 'center',
		actorMargin: 50,
		boxMargin: 10,
		boxTextMargin: 5,
		noteMargin: 10,
		messageMargin: 35
	}
})

interface Props {
	chart: string
	chat_id: string
}

const Mermaid = ({ chart, chat_id }: Props) => {
	const elementRef = useRef<HTMLDivElement>(null)
	const [svg, setSvg] = useState<string>('')
	const [error, setError] = useState<string | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const is_cn = getLocale() === 'zh-CN'

	// Debounce the chart updates
	useEffect(() => {
		let timeoutId: NodeJS.Timeout
		let mounted = true

		const renderDiagram = async () => {
			if (!elementRef.current || !chart) return

			// Skip if already processing
			if (isProcessing) return

			setIsProcessing(true)
			try {
				// Clean and prepare the chart content
				const cleanChart = chart
					.replace(/[""]/g, '"')
					.replace(/['']/g, "'")
					.replace(/^\s+|\s+$/g, '')
					.replace(/\t/g, '    ')

				// Generate a valid ID
				const id = `mermaid-${Math.random().toString(36).substring(2, 15)}`

				// Create a temporary container
				const tempContainer = document.createElement('div')
				tempContainer.id = id
				tempContainer.style.display = 'none'
				document.body.appendChild(tempContainer)

				try {
					// Reset error state before attempting new render
					if (mounted) setError(null)

					// Parse the chart first to validate syntax
					await mermaid.parse(cleanChart)

					// If parsing succeeds, render the chart
					const { svg } = await mermaid.render(id, cleanChart)
					if (mounted) {
						setSvg(svg)
					}
				} finally {
					// Clean up
					tempContainer.remove()
				}
			} catch (err: any) {
				console.error('Failed to render mermaid diagram:', err)
				if (!mounted) return

				// Extract meaningful error message
				let errorMessage = err.message || (is_cn ? '图表渲染失败' : 'Failed to render diagram')
				if (errorMessage.includes('Syntax error')) {
					errorMessage = is_cn ? '语法错误' : 'Syntax error in diagram'
				}
				setError(errorMessage)
				setSvg('') // Clear any previous SVG
			} finally {
				setIsProcessing(false)
			}
		}

		// Debounce render attempts
		timeoutId = setTimeout(renderDiagram, 300)

		return () => {
			clearTimeout(timeoutId)
			mounted = false
		}
	}, [chart, is_cn])

	if (error) {
		return (
			<div className={styles._local}>
				<div
					className='mermaid-error'
					style={{
						padding: '12px',
						border: '1px solid #ffccc7',
						borderRadius: '4px',
						backgroundColor: '#fff2f0',
						marginBottom: '16px'
					}}
				>
					<div
						className='error-message'
						style={{
							display: 'flex',
							alignItems: 'center',
							marginBottom: '8px',
							color: '#cf1322',
							fontSize: '12px'
						}}
					>
						<span className='error-icon' style={{ marginRight: '8px' }}>
							⚠️
						</span>
						{error}
					</div>
					<pre
						className='error-code'
						style={{
							margin: 0,
							padding: '8px',
							backgroundColor: 'rgba(0, 0, 0, 0.04)',
							borderRadius: '2px',
							fontSize: '12px',
							overflow: 'auto'
						}}
					>
						{chart}
					</pre>
				</div>
			</div>
		)
	}

	return (
		<div className={styles._local}>
			{isProcessing ? (
				<div
					style={{
						padding: '20px',
						textAlign: 'center',
						color: '#666'
					}}
				>
					{is_cn ? '正在渲染图表...' : 'Rendering diagram...'}
				</div>
			) : (
				<div ref={elementRef} className='mermaid-diagram' dangerouslySetInnerHTML={{ __html: svg }} />
			)}
		</div>
	)
}

export default Mermaid
