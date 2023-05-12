import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Fragment, useLayoutEffect, useState } from 'react'
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

		return () => {
			x.off()
		}
	}, [parent, model])

	const onFinish = useMemoizedFn((v: any) => {
		x.resetSearchParams()
		x.search(v)
	})
	const resetSearchParams = useMemoizedFn(x.resetSearchParams)

	if (!x.setting.chart) return null
	if (!Object.keys(x.data).length) return null

	const props_filter: IPropsFilter = {
		parent,
		model: x.model,
		columns: toJS(x.filter_columns),
		onFinish,
		resetSearchParams
	}

	const props_chart: IPropsPureChart = {
		data: toJS(x.data),
		columns: toJS(x.chart_columns)
	}

	const Content = (
		<Fragment>
			{x.filter_columns.length > 0 && <Filter {...props_filter} isChart></Filter>}
			<PureChart {...props_chart}></PureChart>
		</Fragment>
	)

	if (parent === 'Page') {
		return (
			<Page
				title={x.setting.name}
				className='w_100'
				actions={toJS(x.setting.actions)}
				full={x.setting?.config?.full}
				withRows
			>
				{Content}
			</Page>
		)
	}

	return <div className='w_100'>{Content}</div>
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
