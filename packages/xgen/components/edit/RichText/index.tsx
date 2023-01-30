import { useFullscreen } from 'ahooks'
import { Button, Tooltip } from 'antd'
import clsx from 'clsx'
import { useLayoutEffect, useRef } from 'react'

import { Item } from '@/components'
import { Icon } from '@/widgets'
import EditorJS from '@editorjs/editorjs'

import { getI18N, getTools } from './editor_config'
import styles from './index.less'

import type { Component } from '@/types'
import type { LogLevels } from '@editorjs/editorjs'

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
	const [is_fullscreen, { toggleFullscreen }] = useFullscreen(container)

	useLayoutEffect(() => {
		if (!container.current) return

		const tools = getTools({
			UploadByFileApi: props.UploadByFileApi?.startsWith('http')
				? props.UploadByFileApi
				: window.location.origin + props.UploadByFileApi,
			UploadByUrlApi: props.UploadByUrlApi?.startsWith('http')
				? props.UploadByUrlApi
				: window.location.origin + props.UploadByUrlApi
		})

		editor.current = new EditorJS({
			logLevel: 'ERROR' as LogLevels,
			holder: container.current,
			data: { blocks: props.value },
			readOnly: props.disabled,
			inlineToolbar: true,
			tools,
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
			className={clsx([styles._local, is_fullscreen && styles.fullscreen, 'w_100 border_box relative'])}
			ref={container}
			style={{ maxHeight: props?.maxHeight || 600 }}
		>
			<div className='tips w_100 text_center'>
				使用<span className='key'>Tab</span>快捷键可唤出选项列表
			</div>
			<Tooltip
				title={`${is_fullscreen ? '退出' : '进入'}全屏`}
				placement='left'
				getPopupContainer={(node) => node.parentNode as HTMLElement}
			>
				<Button
					className='btn_fullsceen none justify_center align_center absolute'
					shape='circle'
					size='small'
					onClick={toggleFullscreen}
				>
					<Icon name={`icon-${is_fullscreen ? 'minimize' : 'maximize'}-2`} size={12}></Icon>
				</Button>
			</Tooltip>
		</div>
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
