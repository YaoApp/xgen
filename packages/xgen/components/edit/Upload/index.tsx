import { useMemoizedFn } from 'ahooks'
import { Upload } from 'antd'
import clsx from 'clsx'

import { Item } from '@/components'
import { getToken } from '@/knife'
import type {
	UploadProgressEvent,
	UploadRequestOption as RcCustomRequestOptions,
	UploadRequestError
} from 'rc-upload/lib/interface'

import UploadBtn from './components/UploadBtn'
import filemap from './filemap'
import useList from './hooks/useList'
import useVisibleBtn from './hooks/useVisibleBtn'
import { ExportValue } from './utils/handleFileList'
import { getLocale } from '@umijs/max'
import { LocalRequest, S3Request } from './request'
import type { UploadFile, UploadProps } from 'antd'
import type { IProps, CustomProps, IPropsUploadBtn, PreviewProps, AllowedFileType } from './types'
import { IRequest, UploadError } from './request/types'
import { useState } from 'react'

import styles from './index.less'
import { ParseSize } from './request/storages/utils'

const Custom = window.$app.memo((props: CustomProps) => {
	const locale = getLocale()
	const {
		api,
		storage,
		maxCount,
		previewSize,
		imageSize,
		chunkSize,
		previewURL,
		useAppRoot,
		__shadow,
		onChange: trigger
	} = props

	const { list, setList } = useList(props.value, previewURL, useAppRoot, api)
	const visible_btn = useVisibleBtn(list.length, maxCount || 1)
	const filetype = filemap[props.filetype] ? props.filetype : 'image'
	const [error, setError] = useState<UploadError | undefined>(undefined)
	const [progress, setProgress] = useState<UploadProgressEvent>(
		new ProgressEvent('progress', { loaded: 0, total: 0 })
	)
	const [request, setRequest] = useState<IRequest | undefined>(undefined)

	const onChange: UploadProps['onChange'] = useMemoizedFn(({ file, fileList }) => {
		const { status } = file
		if (!trigger) return

		if (status === 'done' || status === 'removed') {
			trigger(ExportValue([...fileList], previewURL) as any)
		}
		setList(fileList)
	})

	const abort = () => {
		if (request) {
			request.Abort()
			setError({ code: 499, message: 'Upload aborted' })
		}
	}

	const beforeUpload: UploadProps['beforeUpload'] = useMemoizedFn((file, fileList) => {
		const { maxFilesize } = props
		if (maxFilesize) {
			const maxsize = ParseSize(maxFilesize)
			if (file.size > maxsize) {
				setError({ code: 413, message: `File size too large, max size is ${maxFilesize}` })
				return false
			}
		}
		return true
	})

	const customRequest: UploadProps['customRequest'] = useMemoizedFn(function (options: RcCustomRequestOptions) {
		// const { onError } = options

		options.onProgress = (event: UploadProgressEvent) => {
			setProgress(event)
		}

		options.onError = (event: UploadRequestError | ProgressEvent, body: any) => {
			let code = event instanceof ProgressEvent ? 500 : event.status || 500

			if (body) {
				if (typeof body === 'string') {
					setError({ code: code, message: body })
					return
				}

				if (body.code && body.message) {
					setError(body)
					return
				}

				if (body.message) {
					setError({ code: code, message: body.message })
					return
				}

				return
			}

			setError({ code: code, message: 'Upload failed' })
		}

		// If storage is provided, then it should be a s3 request
		if (storage) {
			const request: IRequest = new S3Request(storage)
			request.Upload && request.Upload(options)
			return
		}

		// If api is provided, then it should be a local request
		if (api) {
			// if api is string, then it should be a local request
			if (typeof api === 'string') {
				const request = new LocalRequest({ chunkSize, previewURL, useAppRoot, api })
				request.Upload && request.Upload(options)
				setRequest(request)
				return
			}

			// if api is object, then it should be a local request
			const request = new LocalRequest({ chunkSize, previewURL, useAppRoot, ...api })
			request.Upload && request.Upload(options)
			setRequest(request)
		}

		// Return error if no storage or api provided
		setError({ code: 400, message: 'No storage or api provided' })
	})

	const props_upload: UploadProps = {
		...props,
		name: 'file',
		listType: filemap[filetype].listType,
		className: clsx(['form_item_upload_wrap', filemap[filetype].className]),
		headers: { authorization: getToken() },
		fileList: list,
		isImageUrl: () => filetype === 'image',
		customRequest,
		beforeUpload,
		onChange
	}

	// The preview props for the custom render
	const size = fmtSize(previewSize || imageSize, filetype)
	const preview_props: PreviewProps = {
		size: size,
		url: props.previewURL,
		useAppRoot: props.useAppRoot,
		storage: props.storage
	}

	props_upload['itemRender'] = (_, file: UploadFile, fileList, { remove }) => {
		const removeFile = async () => {
			setError(undefined)
			setProgress(new ProgressEvent('progress', { loaded: 0, total: 0 }))
			remove()
		}
		return filemap[filetype].preview(preview_props, file, removeFile, abort, { progress, error })
	}

	// Compute the props for the upload button
	const props_upload_btn: IPropsUploadBtn = {
		filetype,
		maxCount,
		size: size,
		placeholder:
			props.placeholder || filemap[filetype].placeholder[locale] || filemap['file'].placeholder['en-US'],
		placeholderIcon:
			props.placeholderIcon || filemap[filetype].placeholderIcon || filemap['file'].placeholderIcon
	}

	return (
		<div
			className={clsx([
				__shadow ? 'xgen-edit-upload' : styles['xgen-edit-upload'],
				__shadow ? filetype : styles[filetype],
				maxCount && maxCount > 1 && 'multiple',
				__shadow
			])}
		>
			<Upload {...props_upload}>{visible_btn && <UploadBtn {...props_upload_btn}></UploadBtn>}</Upload>
		</div>
	)
})

/**
 * Parse the size for the preview
 * @param size
 * @returns
 */
const fmtSize = (size: PreviewProps['size'], filetype: AllowedFileType): PreviewProps['size'] => {
	const defaultSizes: Record<AllowedFileType, PreviewProps['size']> = {
		image: { width: '90px', height: '90px', ratio: 1 },
		video: { width: '288px', height: '162px', ratio: 1 },
		file: { width: '288px', height: '52px', ratio: 1 },
		audio: { width: '288px', height: '52px', ratio: 1 }
	}

	const defaultSize: PreviewProps['size'] = {
		width: size?.width || defaultSizes[filetype]?.width || '90px',
		height: size?.height || defaultSizes[filetype]?.height || '90px',
		ratio: size?.ratio || defaultSizes[filetype]?.ratio || 1
	}

	if (defaultSize.ratio && defaultSize.ratio != 1) {
		const width = parseInt(defaultSize.width as string)
		const height = parseInt(defaultSize.height as string)
		if (!width && !height) {
			defaultSize.width = '100%'
			defaultSize.height = `${100 * defaultSize.ratio}%`
		}
		if (width) {
			defaultSize.width = `${width * defaultSize.ratio}px`
		} else if (height) defaultSize.height = `${width * defaultSize.ratio}px`
	}

	return {
		width: typeof defaultSize.width == 'number' ? `${defaultSize.width}px` : defaultSize.width,
		height: typeof defaultSize.height == 'number' ? `${defaultSize.height}px` : defaultSize.height,
		ratio: defaultSize.ratio
	}
}

const Index = (props: IProps) => {
	const { __bind, __name, itemProps, ...rest_props } = props
	return (
		<Item {...itemProps} {...{ __bind, __name }}>
			<Custom {...rest_props}></Custom>
		</Item>
	)
}

export default window.$app.memo(Index)
