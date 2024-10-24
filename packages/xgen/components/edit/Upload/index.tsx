import { useMemoizedFn } from 'ahooks'
import { Upload } from 'antd'
import clsx from 'clsx'
import { useMemo } from 'react'

import { Item } from '@/components'
import { getToken } from '@/knife'

import Image from './components/Image'
import UploadBtn from './components/UploadBtn'
import filemap from './filemap'
import useList from './hooks/useList'
import useVisibleBtn from './hooks/useVisibleBtn'
import styles from './index.less'
import handleFileList from './utils/handleFileList'
import { getLocale } from '@umijs/max'

import type { UploadProps } from 'antd'
import type { IProps, CustomProps, IPropsUploadBtn, PreviewProps } from './types'

const Custom = window.$app.memo((props: CustomProps) => {
	const locale = getLocale()
	const { api, maxCount, desc, previewSize, imageSize, onChange: trigger } = props
	const { list, setList } = useList(props.value)
	const visible_btn = useVisibleBtn(list.length, maxCount || 1)
	const filetype = filemap[props.filetype] ? props.filetype : 'image'

	const onChange: UploadProps['onChange'] = useMemoizedFn(({ file, fileList }) => {
		const { status } = file

		if (!trigger) return

		if (status === 'done' || status === 'removed') {
			trigger(handleFileList(fileList) as any)
		}

		setList(fileList)
	})

	const action = useMemo(() => {
		if (typeof api === 'string') return api
		if (typeof api === 'undefined') return ''
		return `${api.api}?${new URLSearchParams(api.params).toString()}`
	}, [api])

	const props_upload: UploadProps = {
		...props,
		name: 'file',
		listType: filemap[filetype].listType,
		className: clsx(['form_item_upload_wrap', filemap[filetype].className]),
		action,
		headers: { authorization: getToken() },
		fileList: list,
		isImageUrl: () => filetype === 'image',
		onChange
	}

	const preview_props: PreviewProps = { size: previewSize || imageSize || undefined }
	props_upload['itemRender'] = (_, file, fileList, { remove }) => {
		return filemap[filetype].preview(preview_props, file, remove)
	}

	const props_upload_btn: IPropsUploadBtn = {
		length: list.length,
		filetype,
		maxCount,
		placeholder:
			props.placeholder || filemap[filetype].placeholder[locale] || filemap['file'].placeholder['en-US'],
		placeholderIcon:
			props.placeholderIcon || filemap[filetype].placeholderIcon || filemap['file'].placeholderIcon
	}

	return (
		<div className={clsx([styles._local, styles[filetype]], maxCount && maxCount > 1 && 'multiple')}>
			<Upload {...props_upload}>{visible_btn && <UploadBtn {...props_upload_btn}></UploadBtn>}</Upload>
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
