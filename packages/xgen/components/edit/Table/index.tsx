import clsx from 'clsx'

import Table from '@/components/base/Table'

import styles from './index.less'

import type { IProps as IPropsTable } from '@/components/base/Table'
import type { Component } from '@/types'

interface IProps extends Component.PropsEditComponent {
	model: IPropsTable['model']
	query: IPropsTable['query']
	itemProps?: { label?: string }
}

const Index = (props: IProps) => {
	const { __name, itemProps, model, query } = props

	const props_table: IPropsTable = {
		parent: 'Form',
		model,
		query: query ? query : {},
		hidePagination: true
	}

	return (
		<div className='w_100 flex flex_column'>
			{itemProps?.label !== '' && (
				<div className={clsx([styles.header, 'w_100 flex justify_between align_center'])}>
					<span className='title'>{__name}</span>
					<div className='actions_wrap'></div>
				</div>
			)}
			<Table {...props_table}></Table>
		</div>
	)
}

export default window.$app.memo(Index)
