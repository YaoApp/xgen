import clsx from 'clsx'
import { useEffect, useRef } from 'react'

import { Item } from '@/components'
import EditorJS from '@editorjs/editorjs'

import { getI18N, getTools } from './editor_config'
import styles from './index.less'

import type { Component } from '@/types'

export interface ICustom {
	value: any
	disabled?: boolean
	maxHeight?: number
	UploadByFileApi?: string
	UploadByUrlApi?: string
	onChange?: (v: any) => void
}

interface IProps extends Component.PropsEditComponent, ICustom {}

const Custom = window.$app.memo((props: ICustom) => {
	const container = useRef<HTMLDivElement>(null)
      const editor = useRef<EditorJS>()

	useEffect(() => {
		if (!container.current) return

		editor.current = new EditorJS({
			holder: container.current,
			data: { blocks: props.value },
			readOnly: props.disabled,
			inlineToolbar: true,
			tools: getTools({
				UploadByFileApi: props.UploadByFileApi?.startsWith('http')
					? props.UploadByFileApi
					: window.location.origin + props.UploadByFileApi,
				UploadByUrlApi: props.UploadByUrlApi?.startsWith('http')
					? props.UploadByUrlApi
					: window.location.origin + props.UploadByUrlApi
			}),
			i18n: getI18N(),
			onChange: async () => {
				const res = await editor.current?.save()

				props.onChange?.(res?.blocks)
			}
		})

		return () => editor.current?.destroy?.()
	}, [])

	return (
		<div
			className={clsx([styles._local, 'w_100 border_box'])}
			ref={container}
			style={{ maxHeight: props?.maxHeight || 600 }}
		></div>
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
