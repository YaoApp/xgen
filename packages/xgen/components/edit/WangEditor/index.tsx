import '@wangeditor/editor/dist/css/style.css'

import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

import { Item } from '@/components'
import { getLocale } from '@umijs/max'

import type { Component } from '@/types'
import clsx from 'clsx'
import styles from './index.less'

export interface IWangEditor {
	value: any
	disabled?: boolean
	maxHeight?: number
	UploadByFileApi?: string
	UploadByUrlApi?: string
	placeholder?: string
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, IWangEditor {}

const WangEditor = window.$app.memo((props: IWangEditor) => {
	const is_cn = getLocale() === 'zh-CN'
	const [editor, setEditor] = useState<IDomEditor | null>(null)
	const [html, setHtml] = useState(props.value)
	const toolbarConfig: Partial<IToolbarConfig> = {}
	const editorConfig: Partial<IEditorConfig> = {
		placeholder: props.placeholder || is_cn ? '请输入内容' : 'Please enter content'
	}

	useEffect(() => {
		return () => {
			if (editor == null) return
			editor.destroy()
			setEditor(null)
		}
	}, [editor])

	return (
		<div className={clsx([styles._local])}>
			<Toolbar
				className={clsx([styles._toolbar])}
				editor={editor}
				defaultConfig={toolbarConfig}
				mode='default'
			/>
			<Editor
				className={clsx([styles._editor])}
				mode='default'
				defaultConfig={editorConfig}
				value={html}
				onCreated={setEditor}
				onChange={(editor) => {
					const html = editor.getHtml()
					setHtml(html)
					props.onChange?.(html)
				}}
			/>
		</div>
	)
})

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<WangEditor {...rest_props}></WangEditor>
		</Item>
	)
}

export default window.$app.memo(Index)
