import { useEffect, useMemo, useRef, useState } from 'react'
import Editor from 'react-monaco-editor'

import { Item } from '@/components'
import { useGlobal } from '@/context/app'
import vars from '@/styles/preset/vars'

import styles from './index.less'

import type { Component } from '@/types'

import type { EditorDidMount, monaco } from 'react-monaco-editor'

interface ICustom {
	value: string
	disabled?: boolean
	language?: 'json' | 'javascript'
	height?: number | string
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, ICustom {}

const Custom = window.$app.memo((props: ICustom) => {
	const [value, setValue] = useState<any>()
	const ref = useRef<monaco.editor.IStandaloneCodeEditor>()
	const global = useGlobal()
	const { language = 'json', height = 360 } = props

	const theme = useMemo(() => (global.theme === 'dark' ? 'x-dark' : 'x-light'), [global.theme])

	useEffect(() => {
		if (!props.value) return
		if (typeof props.value !== 'string') {
			try {
				setValue(JSON.stringify(props.value, null, 2))
			} catch (e) {
				console.error(`CodeEditor: ${e}`)
			}
			return
		}
		setValue(props.value)
	}, [props.value])

	const onChange = (v: any) => {
		if (!props.onChange) return
		props.onChange(v)
		setValue(v)
	}

	const editorDidMount: EditorDidMount = (editor, monaco) => {
		ref.current = editor

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
		<Editor
			className={styles._local}
			width='100%'
			height={height}
			language={language}
			theme={theme}
			options={{
				readOnly: props.disabled,
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
			value={value}
			onChange={onChange}
			editorDidMount={editorDidMount}
		></Editor>
	)
})

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Custom {...rest_props}></Custom>
		</Item>
	)
}

export default window.$app.memo(Index)
