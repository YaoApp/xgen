import { Upload } from 'antd'
import clsx from 'clsx'

import { Item } from '@/components'
import { getToken } from '@yaoapp/utils'

import UploadBtn from './components/UploadBtn'
import filemap from './filemap'
import useList from './hooks/useList'
import useVisibleBtn from './hooks/useVisibleBtn'
import styles from './index.less'
import handleFileList from './utils/handleFileList'

import type { UploadProps } from 'antd'
import type { IProps, CustomProps, IPropsUploadBtn } from './types'

const Custom = window.$app.memo((props: CustomProps) => {
	const { filetype, maxCount, desc, onChange: trigger } = props
	const { list, setList } = useList(props.value)
	const visible_btn = useVisibleBtn(list.length, maxCount || 1)

	const onChange: UploadProps['onChange'] = ({ file, fileList }) => {
		const { status } = file

		if (!trigger) return

		if (status === 'done' || status === 'removed') {
			trigger(handleFileList(fileList) as any)
		}

		setList(fileList)
	}

	const props_upload: UploadProps = {
		...props,
		name: 'file',
		listType: filemap[filetype].listType,
		className: clsx(['form_item_upload_wrap', filemap[filetype].className]),
		action: `/api/${localStorage.getItem('__api_prefix')}/storage/upload`,
		headers: { authorization: getToken() },
		fileList: list,
		isImageUrl: () => filetype === 'image',
		onChange
	}

	if (filemap[filetype]?.render) {
		props_upload['itemRender'] = filemap[filetype].render
	}

	const props_upload_btn: IPropsUploadBtn = {
		length: list.length,
		filetype,
		maxCount,
		desc
	}

	return (
		<div className={clsx([styles._local, styles[filetype]])}>
			<Upload {...props_upload}>
				{visible_btn && <UploadBtn {...props_upload_btn}></UploadBtn>}
			</Upload>
		</div>
	)
})

const Index = (props: IProps) => {
	const { __bind, __name, __data_item, itemProps, ...rest_props } = props

	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Custom {...rest_props}></Custom>
		</Item>
	)
}

export default window.$app.memo(Index)
