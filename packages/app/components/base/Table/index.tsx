import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Filter, Page, PureTable } from '@/components'

import styles from './index.less'
import Model from './model'

export interface IPropsTable {
	parent: 'Page' | 'Modal'
	model: string
}

import type { IPropsFilter } from '@/components/base/Filter/types'

const Index = (props: IPropsTable) => {
	const { parent, model } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.model = model

		x.getSetting()
	}, [])

	if (parent === 'Page') {
		if (!x.setting.table) return null

		const props_filter: IPropsFilter = {
			model: x.model,
			columns: x.filter_columns,
			btnAddText: x.setting.filter?.btnAddText
		}

		return (
			<Page className={clsx([styles._local, 'w_100'])}>
				<Filter {...props_filter}></Filter>
				<PureTable></PureTable>
			</Page>
		)
	}

	return (
		<div className={clsx([styles._local, 'w_100'])}>
			<PureTable></PureTable>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
