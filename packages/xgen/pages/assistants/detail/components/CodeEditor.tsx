import { useEffect, useMemo, useState } from 'react'
import Editor from 'react-monaco-editor'
import { useGlobal } from '@/context/app'
import vars from '@/styles/preset/vars'
import styles from '../index.less'

interface CodeEditorProps {
	code: string
	onChange: (code: string) => void
}

const AssistantCodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
	const [value, setValue] = useState(code)
	const global = useGlobal()

	const theme = useMemo(() => (global.theme === 'dark' ? 'x-dark' : 'x-light'), [global.theme])

	useEffect(() => {
		setValue(code)
	}, [code])

	const handleChange = (newValue: string) => {
		setValue(newValue)
		onChange(newValue)
	}

	const editorDidMount = (editor: any, monaco: any) => {
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
		<div className={styles.codeEditor}>
			<Editor
				width='100%'
				height='calc(100vh - 300px)'
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
	)
}

export default AssistantCodeEditor
