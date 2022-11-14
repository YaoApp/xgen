import { useMemoizedFn } from 'ahooks'
import clsx from 'clsx'
import { Else, If, Then } from 'react-if'
import { ReactSortable } from 'react-sortablejs'

import Row from '../Row'
import styles from './index.less'

import type { IPropsList } from '../../types'

const Index = (props: IPropsList) => {
	const { list, parentIds = [], onChange: _onChange } = props

	const onChange = useMemoizedFn(_onChange)

	return (
		<div
			className={clsx([
				styles._local,
				styles.list_wrap,
				parentIds?.length && styles.children_wrap,
				'w_100 border_box flex flex_column'
			])}
		>
			<ReactSortable list={list} handle='.handle' animation={150} setList={(v) => onChange(v, parentIds)}>
				{list.map((item) => (
					<If condition={!item.children?.length} key={item.id}>
						<Then>
							<Row dataItem={item}></Row>
						</Then>
						<Else>
							<Row dataItem={item}></Row>
							<Index
								list={item.children}
								parentIds={[...parentIds, item.id]}
								onChange={onChange}
							></Index>
						</Else>
					</If>
				))}
			</ReactSortable>
		</div>
	)
}

export default window.$app.memo(Index)
