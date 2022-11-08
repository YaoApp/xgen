import { useMemoizedFn } from 'ahooks'
import axios from 'axios'
import { cloneDeep, findIndex } from 'lodash-es'
import { useEffect, useState } from 'react'

import Table from '@/components/base/Table'

import type { IProps as IPropsTable } from '@/components/base/Table'

import type { IPropsStep3 } from '../types'

const Index = (props: IPropsStep3) => {
	const { api, preview_payload } = props
	const [data, setData] = useState<any>({})
	const namespace = 'Page/Import/preview'

	const save = useMemoizedFn((v: any) => {
		const index = findIndex(data.data, (item: any) => item.id === v.id)
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
		if (!preview_payload?.mapping) return

		getData()
	}, [api, preview_payload])

	const getData = async () => {
		const data = await axios(api.preview, {
			method: 'POST',
			data: preview_payload
		})

		setData(data)
	}

	const props_table: IPropsTable = {
		parent: 'Custom',
		model: api.preview_setting_model,
		data: data.data,
		namespace,
		hidePagination: true
	}

	return <Table {...props_table}></Table>
}

export default window.$app.memo(Index)
