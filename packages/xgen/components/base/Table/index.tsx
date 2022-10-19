import { useMemoizedFn } from 'ahooks'
import clsx from 'clsx'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Fragment, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Filter, Page, PureTable, X } from '@/components'

import styles from './index.less'
import Model from './model'

import type { Component } from '@/types'

import type { IPropsFilter } from '@/components/base/Filter/types'
import type { IPropsPureTable } from '@/components/base/PureTable/types'
import type { Global } from '@/types'

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
		const customAction = (
			<Fragment>
				{x.setting.header.preset?.import && (
					<X
						type='optional'
						name='Table/Import'
						props={{
							...x.setting.header.preset.import,
							search: () => x.search()
						}}
					></X>
				)}
				{x.setting.header.preset?.batch && (
					<X
						type='optional'
						name='Table/Batch'
						props={{
							namespace: x.namespace.value,
							columns: toJS(x.batch_columns),
							deletable: x.setting.header.preset?.batch.deletable,
							batch: toJS(x.batch),
							setBatchActive(v: boolean) {
								x.batch.active = v
								x.batch.selected = []
							}
						}}
					></X>
				)}
			</Fragment>
		)

		const props_filter: IPropsFilter = {
			model: x.model,
			namespace: x.namespace.value,
			columns: toJS(x.filter_columns),
			actions: toJS(x.setting.filter?.actions),
			onFinish,
			resetSearchParams
		}

		return (
			<Page
				className={clsx([styles._local, 'w_100'])}
				customAction={customAction}
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
