import { useAsyncEffect } from 'ahooks'
import { message } from 'antd'
import to from 'await-to-js'
import axios from 'axios'
import { useState } from 'react'

export default (dataSource: string) => {
	const [data, setData] = useState()

	useAsyncEffect(async () => {
		const [err, res] = await to<any>(axios.get(`/api/${window.$app.api_prefix}${dataSource}`))

		if (err) return message.error(`request error, dataSource:${dataSource}.`)

		setData(res)
	}, [dataSource])

	return data
}
