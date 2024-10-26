import { useEffect, useState } from 'react'
import type { IProps } from '../types'
import type { UploadFile } from 'antd/lib/upload/interface'
import { UploadResponse } from '../request/types'
import { GetPreviewURL } from '../request/storages/utils'
import { getToken } from '@/knife'

export default (
	value: IProps['value'],
	previewURL?: string,
	useAppRoot?: boolean,
	api?: string | { api: string; params: any }
) => {
	const [list, setList] = useState<Array<UploadFile<IProps['value']>>>([])
	useEffect(() => {
		if (!value) return

		const list = (Array.isArray(value) ? value : [value]).reduce(
			(total: Array<UploadFile<IProps['value']>>, v: any) => {
				const item: UploadResponse = typeof v === 'string' ? { path: v } : v

				// If the item has a url, parse preview url
				if (!item.url) {
					item.url = GetPreviewURL({
						response: item,
						token: getToken(),
						previewURL,
						useAppRoot,
						api
					})
				}

				const real_item = {
					uid: uid(item),
					name: item.name || item.path,
					response: item,
					thumbUrl: item.url || item.path
				} as UploadFile<IProps['value']>

				// Image preview
				if (/(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(item.path || '')) {
					real_item['thumbUrl'] = item.url || item.path
				}
				total.push(real_item)
				return total
			},
			[]
		)
		setList(list)
	}, [value])

	return { list, setList }
}

/**
 * Generate a unique id for the item
 * @param item
 * @returns
 */
function uid(item: UploadResponse): string {
	if (item.path) {
		return item.path
	}
	const now = new Date()
	const random = Math.floor(Math.random() * 100000) + 1
	return `file-${now.getTime()}.${now.getMilliseconds()}.${random}`
}
