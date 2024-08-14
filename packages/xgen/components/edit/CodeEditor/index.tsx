import { useEffect, useMemo, useRef, useState } from 'react'
import Editor from 'react-monaco-editor'

import { Item } from '@/components'
import { useGlobal } from '@/context/app'
import vars from '@/styles/preset/vars'

import styles from './index.less'

import type { Component } from '@/types'

import yaml from 'js-yaml'
import type { EditorDidMount, monaco } from 'react-monaco-editor'
import { message } from 'antd'
import { getLocale } from '@umijs/max'

interface ICustom {
	value: string
	disabled?: boolean
	language?: 'json' | 'javascript' | 'typescript' | 'yaml' | 'html' | 'css' | 'sql' | 'markdown'
	hideLineNumbers?: boolean
	height?: number | string

	__name: string
	__namespace: string
	__bind: string
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, ICustom {}

const Custom = window.$app.memo((props: ICustom) => {
	const [value, setValue] = useState<any>()
	const ref = useRef<monaco.editor.IStandaloneCodeEditor>()
	const global = useGlobal()
	const { language = 'json', height = 360 } = props

	const theme = useMemo(() => (global.theme === 'dark' ? 'x-dark' : 'x-light'), [global.theme])
	const is_cn = getLocale() === 'zh-CN'
	const key = `${props.__namespace}.${props.__bind}`
	const { dataCache } = global

	useEffect(() => {
		if (dataCache[key] === props.value) {
			setValue(props.value)
			return
		}
		if (!props.value) return
		if (typeof props.value !== 'string' && props.value !== undefined && props.value !== null) {
			// YAML stringify
			if (language === 'yaml') {
				try {
					setValue(yaml.dump(props.value))
				} catch (e) {
					console.error(`CodeEditor: ${e}`)
					message.error(
						is_cn
							? `YAML 格式错误 ${props.__name} (${props.__bind})`
							: `YAML format error ${props.__name} (${props.__bind})`
					)
				}
				return
			}

			// JSON stringify
			try {
				setValue(JSON.stringify(props.value, null, 2))
			} catch (e) {
				console.error(`CodeEditor: ${e}`)
				message.error(
					is_cn
						? `JSON 格式错误 ${props.__name} (${props.__bind})`
						: `JSON format error ${props.__name} (${props.__bind})`
				)
			}
			return
		}
		setValue(props.value)
	}, [props.value])

	const onChange = (v: any) => {
		if (!props.onChange) return
		props.onChange(v)
		dataCache[key] = v
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

		// fix select all when the editor is loaded
		editor.onDidChangeModelContent(() => {
			const position = editor.getPosition()
			if (position && editor.getModel()?.getValue() != '') {
				editor.setPosition(position)
			}
		})
	}

	const editorWillUnmount = () => {
		dataCache[key] && delete dataCache[key]
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
				lineNumbers: props.hideLineNumbers ? 'off' : 'on',
				scrollbar: { verticalScrollbarSize: 8, horizontalSliderSize: 8, useShadows: false }
			}}
			value={value}
			onChange={onChange}
			editorDidMount={editorDidMount}
			editorWillUnmount={editorWillUnmount}
		></Editor>
	)
})

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Custom {...{ __bind, __name }} {...rest_props}></Custom>
		</Item>
	)
}

export default window.$app.memo(Index)
