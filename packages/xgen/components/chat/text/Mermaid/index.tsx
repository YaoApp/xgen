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
}

const Mermaid = ({ chart }: Props) => {
	const elementRef = useRef<HTMLDivElement>(null)
	const [svg, setSvg] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [key, setKey] = useState(0) // Add a key for forcing re-render
	const is_cn = getLocale() === 'zh-CN'

	useEffect(() => {
		let mounted = true
		const renderDiagram = async () => {
			if (!elementRef.current || !chart) return
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
					if (mounted) setError('')

					// Parse the chart first to validate syntax
					await mermaid.parse(cleanChart)

					// If parsing succeeds, render the chart
					const { svg } = await mermaid.render(id, cleanChart)
					if (mounted) {
						setSvg(svg)
						setKey((prev) => prev + 1) // Force re-render on successful update
					}
				} finally {
					// Clean up
					tempContainer.remove()
				}
			} catch (error: any) {
				console.error('Failed to render mermaid diagram:', error)
				// if (!mounted) return

				// let errorMessage = is_cn ? '图表语法错误' : 'Chart syntax error'
				// if (error?.str) {
				// 	// Clean up error message
				// 	errorMessage = error.str
				// 		.replace(/mermaid version \d+\.\d+\.\d+/g, '')
				// 		.replace(/Syntax error in text/g, is_cn ? '语法错误' : 'Syntax error')
				// 		.trim()
				// } else if (error?.message) {
				// 	errorMessage = error.message
				// }
				// setError(errorMessage)
				// setSvg('')
			}
		}

		renderDiagram()
		return () => {
			mounted = false
		}
	}, [chart, is_cn])

	if (error) {
		return (
			<div className={styles._local}>
				<div className='mermaid-error'>
					<div className='error-message'>
						<span className='error-icon'>⚠️</span>
						{error}
					</div>
					<pre className='error-code'>{chart}</pre>
				</div>
			</div>
		)
	}

	return (
		<div className={styles._local} key={key}>
			<div ref={elementRef} className='mermaid-diagram' dangerouslySetInnerHTML={{ __html: svg }} />
		</div>
	)
}

export default Mermaid
