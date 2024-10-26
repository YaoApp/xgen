import type { UploadFile } from 'antd/lib/upload/interface'
import { ValueType } from '../types'
import { FixPath } from '../request/storages/utils'

export function ExportValue(value: Array<UploadFile<ValueType>>, previewURL?: string) {
	const values: Array<string> = []
	value.forEach((item) => {
		if (item.response) {
			const path = typeof item.response === 'string' ? item.response : item.response.path
			path && values.push(FixPath(path, previewURL === undefined))
		}
	})
	return values
}

export function GetPreviewURL(v?: ValueType) {
	if (!v) return ''
	if (typeof v === 'string') return v
	if (v.url) return v.url
	return ''
}
