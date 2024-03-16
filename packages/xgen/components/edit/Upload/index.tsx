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

import type { UploadProps } from 'antd'
import type { IProps, CustomProps, IPropsUploadBtn } from './types'

const Custom = window.$app.memo((props: CustomProps) => {
	const { api, filetype, maxCount, desc, imageSize, onChange: trigger } = props
	const { list, setList } = useList(props.value)
	const visible_btn = useVisibleBtn(list.length, maxCount || 1)

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

		return `${api.api}?${new URLSearchParams(api.params).toString()}`
	}, [api])

	const props_upload: UploadProps = {
		...props,
		name: 'file',
		listType: filemap[filetype].listType,
		className: clsx([
			'form_item_upload_wrap',
			filemap[filetype].className,
			filetype === 'image' && imageSize && 'custom'
		]),
		action,
		headers: { authorization: getToken() },
		fileList: list,
		isImageUrl: () => filetype === 'image',
		onChange
	}

	if (filemap[filetype]?.render) {
		props_upload['itemRender'] = filemap[filetype].render
	}

	if (filetype === 'image' && imageSize) {
		if (!imageSize.width && !imageSize.height) {
			imageSize.height = '92px'
		}
		props_upload['itemRender'] = (_, file, _fileList, { remove }) => (
			<Image file={file} imageSize={imageSize} remove={remove}></Image>
		)
	}

	const props_upload_btn: IPropsUploadBtn = {
		length: list.length,
		filetype,
		maxCount,
		desc
	}

	return (
		<div className={clsx([styles._local, styles[filetype]])}>
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
