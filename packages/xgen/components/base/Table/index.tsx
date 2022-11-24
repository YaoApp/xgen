import { useMemoizedFn } from 'ahooks'
import clsx from 'clsx'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Filter, Page, PureTable } from '@/components'

import { CustomAction } from './components'
import styles from './index.less'
import Model from './model'

import type { Component } from '@/types'

import type { IPropsFilter } from '@/components/base/Filter/types'
import type { IPropsPureTable } from '@/components/base/PureTable/types'
import type { Global } from '@/types'
import type { IPropsCustomAction } from './types'

export interface IProps extends Component.StackComponent {
	query?: Global.StringObject
	data?: Array<any>
	namespace?: string
	hidePagination?: IPropsPureTable['hidePagination']
}

const Index = (props: IProps) => {
	const { parent, model, query, data, namespace, hidePagination } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init(parent, model, query, data, namespace)

		return () => {
			x.off()
		}
	}, [parent, model, query, data])

	const setBatchSelected = useMemoizedFn((v: Array<number>) => (x.batch.selected = v))
	const onFinish = useMemoizedFn((v: any) => {
		x.resetSearchParams()

		window.$app.Event.emit(`${x.namespace.value}/search`, v)
	})
	const resetSearchParams = useMemoizedFn(x.resetSearchParams)
	const search = useMemoizedFn(x.search)
	const setBatchActive = useMemoizedFn((v: boolean) => {
		x.batch.active = v
		x.batch.selected = []
	})

	if (!x.setting.table) return null

	const props_table: IPropsPureTable = {
		parent,
		namespace: x.namespace.value,
		primary: x.setting.primary,
		list: toJS(x.list),
		columns: toJS(x.table_columns),
		pagination: toJS(x.pagination),
		props: toJS(x.setting.table.props),
		operation: toJS(x.setting.table.operation),
		batch: toJS(x.batch),
		hidePagination,
		setBatchSelected
	}

	if (parent === 'Page') {
		const props_filter: IPropsFilter = {
			model: x.model,
			namespace: x.namespace.value,
			columns: toJS(x.filter_columns),
			actions: toJS(x.setting.filter?.actions),
			onFinish,
			resetSearchParams
		}

		const props_custom_action: IPropsCustomAction = {
			setting: toJS(x.setting),
			namespace: x.namespace.value,
			batch_columns: toJS(x.batch_columns),
			batch: toJS(x.batch),
			search,
			setBatchActive
		}

		return (
			<Page
				className={clsx([styles._local, 'w_100'])}
				customAction={<CustomAction {...props_custom_action}></CustomAction>}
				full={x.setting?.config?.full}
			>
				<Filter {...props_filter}></Filter>
				<PureTable {...props_table}></PureTable>
			</Page>
		)
	}

	return (
		<div className={clsx([styles._local, x.parent === 'Form' ? styles.in_form : 'w_100'])}>
			<PureTable {...props_table}></PureTable>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).get()
