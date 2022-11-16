import clsx from 'clsx'
import { Else, If, Then } from 'react-if'
import { ReactSortable } from 'react-sortablejs'

import Row from '../Row'
import styles from './index.less'

import type { IPropsList } from '../../types'

const Index = (props: IPropsList) => {
	const { list, parentIds = [], onSort, onAction } = props

	return (
		<div
			className={clsx([
				styles.list_wrap,
				parentIds?.length && styles.children_wrap,
				'w_100 border_box flex flex_column'
			])}
		>
			<ReactSortable list={list} handle='.handle' animation={150} setList={(v) => onSort(v, parentIds)}>
				{list.map((item) => (
					<If condition={!item.children?.length} key={item.id}>
						<Then>
							<Row
								dataItem={item}
								parentIds={[...parentIds, item.id]}
								fold={item?._fold}
								onAction={onAction}
							></Row>
						</Then>
						<Else>
							<div className='w_100 flex flex_wrap'>
								<Row
									dataItem={item}
									parentIds={[...parentIds, item.id]}
									fold={item?._fold}
									onAction={onAction}
								></Row>
								<Index
									list={item?._fold ? [] : item.children}
									parentIds={[...parentIds, item.id]}
									onSort={onSort}
									onAction={onAction}
								></Index>
							</div>
						</Else>
					</If>
				))}
			</ReactSortable>
		</div>
	)
}

export default window.$app.memo(Index)
