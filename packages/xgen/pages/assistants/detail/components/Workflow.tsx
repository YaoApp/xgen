import { useState, useRef, useEffect } from 'react'
import Editor from 'react-monaco-editor'
import { useGlobal } from '@/context/app'
import vars from '@/styles/preset/vars'
import styles from '../index.less'

const defaultWorkflow = {
	version: '1.0',
	name: 'Example Workflow',
	description: 'This is an example workflow configuration',
	triggers: [],
	actions: [],
	conditions: []
}

const Workflow = () => {
	const [value, setValue] = useState(JSON.stringify(defaultWorkflow, null, 2))
	const global = useGlobal()
	const theme = global.theme === 'dark' ? 'x-dark' : 'x-light'
	const editorRef = useRef<any>(null)

	useEffect(() => {
		const resizeObserver = new ResizeObserver(() => {
			if (editorRef.current) {
				editorRef.current.layout()
			}
		})

		const container = document.querySelector(`.${styles.workflow}`)
		if (container) {
			resizeObserver.observe(container)
		}

		return () => {
			resizeObserver.disconnect()
		}
	}, [])

	const editorDidMount = (editor: any, monaco: any) => {
		editorRef.current = editor

		monaco.editor.defineTheme('x-dark', {
			base: 'vs-dark',
			inherit: true,
			rules: [],
			colors: {
				'editor.background': vars[global.theme].color_bg_nav
			}
		})

		monaco.editor.defineTheme('x-light', {
			base: 'vs',
			inherit: true,
			rules: [],
			colors: {
				'editor.background': vars[global.theme].color_bg_nav
			}
		})

		monaco.editor.setTheme(theme)
	}

	return (
		<div className={styles.workflow}>
			<Editor
				width='100%'
				height='100%'
				language='json'
				theme={theme}
				value={value}
				onChange={setValue}
				editorDidMount={editorDidMount}
				options={{
					wordWrap: 'on',
					formatOnPaste: true,
					formatOnType: true,
					renderLineHighlight: 'none',
					smoothScrolling: true,
					padding: { top: 15 },
					lineNumbersMinChars: 3,
					minimap: { enabled: false },
					scrollbar: { verticalScrollbarSize: 8, horizontalSliderSize: 8, useShadows: false }
				}}
			/>
		</div>
	)
}

export default Workflow
