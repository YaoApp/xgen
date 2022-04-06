import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Filter, Page, PureTable } from '@/components'

import styles from './index.less'
import Model from './model'

import type { IPropsTable } from './types'

import type { IPropsFilter } from '@/components/base/Filter/types'
import type { IPropsPureTable } from '@/components/base/PureTable/types'

const Index = (props: IPropsTable) => {
	const { parent, model } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init(parent, model)

		return () => {
			x.off()
		}
	}, [])

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
			namespace: x.namespace.value,
			columns: x.filter_columns,
			btnAddText: x.setting.filter?.btnAddText,
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
		<div className={clsx([styles._local, 'w_100'])}>
			<PureTable {...props_table}></PureTable>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
