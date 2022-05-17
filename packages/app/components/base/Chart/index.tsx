import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Filter, Page, PureChart } from '@/components'

import Model from './model'

import type { Component } from '@/types'
import type { IPropsFilter } from '@/components/base/Filter/types'
import type { IPropsPureChart } from '@/components/base/PureChart/types'

const Index = (props: Component.BaseComponent) => {
	const { parent, model } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init(parent, model)
	}, [x, parent, model])

	if (!x.setting.chart) return null

	const props_filter: IPropsFilter = {
		model: x.model,
		columns: x.filter_columns,
		onFinish(v: any) {
			x.resetSearchParams()
			x.search(v)
		},
		resetSearchParams: x.resetSearchParams
	}

	const props_chart: IPropsPureChart = {
		data: x.data,
		columns: x.chart_columns
	}

	if (parent === 'Page') {
		return (
			<Page className='w_100' isChart actions={x.setting.operation.actions}>
				<Filter {...props_filter} isChart></Filter>
				<PureChart {...props_chart}></PureChart>
			</Page>
		)
	}

	return (
		<div className='w_100'>
			<Filter {...props_filter}></Filter>
			<PureChart {...props_chart}></PureChart>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
