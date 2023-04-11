import { useEffect, useState } from 'react'

import { getFileSrc } from '@/knife'

import type { IProps } from '../types'
import type { UploadFile } from 'antd/lib/upload/interface'

export default (value: IProps['value']) => {
	const [list, setList] = useState<Array<UploadFile<string>>>([])

	useEffect(() => {
		if (!value) return

		const list = (Array.isArray(value) ? value : [value]).reduce(
			(total: Array<UploadFile<string>>, item: any) => {
				const real_item = {
					uid: item,
					name: item,
					response: item,
					thumbUrl: item
				} as UploadFile<string>

				if (/(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(item)) {
					real_item['thumbUrl'] = getFileSrc(item)
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
