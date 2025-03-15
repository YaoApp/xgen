import { useState } from 'react'
import Editor from 'react-monaco-editor'
import { useGlobal } from '@/context/app'
import vars from '@/styles/preset/vars'
import styles from '../index.less'
import { getLocale } from '@umijs/max'
import { Form } from 'antd'

const defaultTools = {
	tools: [
		{
			name: 'example_tool',
			description: 'An example tool',
			parameters: {
				type: 'object',
				properties: {
					param1: {
						type: 'string',
						description: 'First parameter'
					},
					param2: {
						type: 'number',
						description: 'Second parameter'
					}
				},
				required: ['param1']
			}
		}
	]
}

export default function Tools() {
	const [value, setValue] = useState(JSON.stringify(defaultTools, null, 2))
	const global = useGlobal()
	const theme = global.theme === 'dark' ? 'x-dark' : 'x-light'
	const locale = getLocale()
	const is_cn = locale === 'zh-CN'
	const [form] = Form.useForm()
	const readonly = Form.useWatch('readonly', form)

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
		<div className={styles.functions}>
			<Editor
				width='100%'
				height='100%'
				language='json'
				theme={theme}
				value={value}
				onChange={readonly ? undefined : setValue}
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
					scrollbar: { verticalScrollbarSize: 8, horizontalSliderSize: 8, useShadows: false },
					readOnly: readonly
				}}
			/>
		</div>
	)
}
