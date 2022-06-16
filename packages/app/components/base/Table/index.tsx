import clsx from 'clsx'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Fragment, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Filter, Page, PureTable, X } from '@/components'
import { history } from '@umijs/max'

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
	}, [x, parent, model, query, data])

	if (!x.setting.table) return null

	const props_table: IPropsPureTable = {
		parent,
		namespace: x.namespace.value,
		primary: x.setting.primary,
		list: x.list,
		columns: x.table_columns,
		pagination: x.pagination,
		props: x.setting.table.props,
		operation: x.setting.table.operation,
		batch: toJS(x.batch),
		hidePagination,
		setBatchSelected(v: Array<number>) {
			x.batch.selected = v
		}
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
			columns: x.filter_columns,
			btnAddText: x.setting.filter?.btnAddText,
			onFinish(v: any) {
				x.resetSearchParams()

				window.$app.Event.emit(`${x.namespace.value}/search`, v)
			},
			onAdd() {
				history.push(`/x/Form/${model}/0/edit`)
			},
			resetSearchParams: x.resetSearchParams
		}

		return (
			<Page className={clsx([styles._local, 'w_100'])} customAction={customAction}>
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

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
