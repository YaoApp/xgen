import { useMemoizedFn } from 'ahooks'
import axios from 'axios'
import { cloneDeep, findIndex } from 'lodash-es'
import { useEffect, useState } from 'react'

import Table from '@/components/base/Table'

import type { IProps as IPropsTable } from '@/components/base/Table'
import type { IPropsStep2 } from '../types'

const Index = (props: IPropsStep2) => {
	const { api, file_name, setPreviewPayload } = props
	const [data, setData] = useState<any>({})
	const namespace = 'Page/Import/mapping'

	const save = useMemoizedFn((v: any) => {
		const index = findIndex(data.data, (item: any) => item.field === v.field)
		const _data = cloneDeep(data.data)

		_data[index] = { ..._data[index], ...v }

		setData({ ...data, data: _data })
	})

	useEffect(() => {
		window.$app.Event.on(`${namespace}/save`, save)

		return () => {
			window.$app.Event.off(`${namespace}/save`, save)
		}
	}, [namespace, data])

	useEffect(() => {
		if (!file_name) return

		getData()
	}, [api, file_name])

	useEffect(() => {
		setPreviewPayload({
			file: file_name,
			page: 1,
			size: 10,
			mapping: data
		})
	}, [file_name, data])

	const getData = async () => {
		const data = await axios.get(api.mapping + `?file=${file_name}`)

		setData(data)
	}

	const props_table: IPropsTable = {
		parent: 'Custom',
		model: api.mapping_setting_model,
		data: data.data,
		namespace,
		hidePagination: true
	}

	if (!data?.data?.length) return null

	return <Table {...props_table}></Table>
}

export default window.$app.memo(Index)
