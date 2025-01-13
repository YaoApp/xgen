import { useEffect, useMemo, useRef, useState } from 'react'
import Editor from 'react-monaco-editor'
import { useGlobal } from '@/context/app'
import { Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import vars from '@/styles/preset/vars'
import styles from '../index.less'

interface ScriptProps {
	code: string
	onChange: (code: string) => void
	onSave?: () => void
}

const Script: React.FC<ScriptProps> = ({ code, onChange, onSave }) => {
	const [value, setValue] = useState(code)
	const global = useGlobal()
	const editorRef = useRef<any>(null)

	const theme = useMemo(() => (global.theme === 'dark' ? 'x-dark' : 'x-light'), [global.theme])

	useEffect(() => {
		setValue(code)
	}, [code])

	useEffect(() => {
		const resizeObserver = new ResizeObserver(() => {
			if (editorRef.current) {
				editorRef.current.layout()
			}
		})

		const container = document.querySelector(`.${styles.script}`)
		if (container) {
			resizeObserver.observe(container)
		}

		return () => {
			resizeObserver.disconnect()
		}
	}, [])

	const handleChange = (newValue: string) => {
		setValue(newValue)
		onChange(newValue)
	}

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
		<div className={styles.scriptContainer}>
			{onSave && (
				<div className={styles.scriptHeader}>
					<Button type='primary' icon={<SaveOutlined />} onClick={onSave}>
						Save
					</Button>
				</div>
			)}
			<div className={styles.script}>
				<Editor
					width='100%'
					height='100%'
					language='javascript'
					theme={theme}
					value={value}
					onChange={handleChange}
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
		</div>
	)
}

export default Script
