import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Filter, Page, PureTable } from '@/components'
import { history } from '@umijs/max'

import styles from './index.less'
import Model from './model'

import type { Component } from '@/types'

import type { IPropsFilter } from '@/components/base/Filter/types'
import type { IPropsPureTable } from '@/components/base/PureTable/types'
import type { Global } from '@/types'

export interface IProps extends Component.StackComponent {
	query?: Global.StringObject
}

const Index = (props: IProps) => {
	const { parent, model, query } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init(parent, model, query)

		return () => {
			x.off()
		}
	}, [x, parent, model, query])

	if (!x.setting.table) return null

	const props_table: IPropsPureTable = {
		parent,
		namespace: x.namespace.value,
		primary: x.setting.primary,
		list: x.list,
		columns: x.table_columns,
		pagination: x.pagination,
		props: x.setting.table.props,
		operation: x.setting.table.operation
	}

	if (parent === 'Page') {
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
			<Page className={clsx([styles._local, 'w_100'])}>
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
