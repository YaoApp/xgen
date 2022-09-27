import clsx from 'clsx'

import Table from '@/components/base/Table'
import { getDeepValue } from '@/knife'

import styles from './index.less'

import type { IProps as IPropsTable } from '@/components/base/Table'
import type { Component } from '@/types'

interface IProps extends Component.PropsEditComponent {
	model: IPropsTable['model']
	query: IPropsTable['query']
}

const Index = (props: IProps) => {
	const { __data_item, __name, model, query } = props

	if (!Object.keys(__data_item).length) return null

	const props_table: IPropsTable = {
		parent: 'Form',
		model,
		query: query ? getDeepValue(query, __data_item) : {},
		hidePagination: true
	}

	return (
		<div className='w_100 flex flex_column'>
			<div className={clsx([styles.header, 'w_100 flex justify_between align_center'])}>
				<span className='title'>{__name}</span>
				<div className='actions_wrap'></div>
			</div>
			<Table {...props_table}></Table>
		</div>
	)
}

export default window.$app.memo(Index)
