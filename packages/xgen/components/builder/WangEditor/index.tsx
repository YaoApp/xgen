import '@wangeditor/editor/dist/css/style.css'

import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

import Item from '../Item'
import { getLocale } from '@umijs/max'
import Upload from './upload'

import type { Component } from '@/types'
import clsx from 'clsx'
import styles from './index.less'

export interface IWangEditor {
	value: any
	disabled?: boolean
	autoFocus?: boolean
	minHeight?: number
	imageUrl?: string
	imageUpload?: string
	videoUpload?: string
	videoUrl?: string
	placeholder?: string
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, IWangEditor {}

const WangEditor = window.$app.memo((props: IWangEditor) => {
	const is_cn = getLocale() === 'zh-CN'
	const [editor, setEditor] = useState<IDomEditor | null>(null)
	const [html, setHtml] = useState(props.value)
	const minHeight = props.minHeight || 300
	const toolbarConfig: Partial<IToolbarConfig> = {}
	const editorConfig: Partial<IEditorConfig> = {
		placeholder: props.placeholder || is_cn ? '请输入内容' : 'Please enter content',
		autoFocus: props.autoFocus || false,
		readOnly: props.disabled || false,
		MENU_CONF: {}
	}

	// Upload Image
	if (props.imageUpload && props.imageUpload != '') {
		editorConfig.MENU_CONF!['uploadImage'] = {
			async customUpload(file: File, insertFn: any) {
				if (props.imageUpload) {
					const { path, url } = await Upload.File(props.imageUpload, file, props.imageUrl)
					if (insertFn) {
						insertFn(url, '', url)
					}
				}
			}
		}
	}

	// Upload Video
	if (props.videoUpload && props.videoUpload != '') {
		editorConfig.MENU_CONF!['uploadVideo'] = {
			async customUpload(file: File, insertFn: any) {
				if (props.videoUpload) {
					const { path, url } = await Upload.File(props.videoUpload, file, props.videoUrl)
					if (insertFn) {
						insertFn(url, '', url)
					}
				}
			}
		}
	}

	useEffect(() => {
		if (editor == null) return
		if (props.value == undefined) return
		if (props.value == html) return
		setHtml(props.value)
	}, [props.value])

	useEffect(() => {
		return () => {
			if (editor == null) return
			editor.destroy()
			setEditor(null)
		}
	}, [editor])

	return (
		<div className={clsx([styles._local])} style={{ paddingLeft: 12, paddingRight: 12 }}>
			<Toolbar
				className={clsx([styles._toolbar])}
				editor={editor}
				defaultConfig={toolbarConfig}
				mode='default'
			/>
			<Editor
				mode='default'
				className={clsx([styles._editor])}
				style={{ minHeight: minHeight }}
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
	const { __bind, __name, ...rest_props } = props
	return (
		<Item {...{ __bind, __name }}>
			<WangEditor {...rest_props}></WangEditor>
		</Item>
	)
}

export default window.$app.memo(Index)
