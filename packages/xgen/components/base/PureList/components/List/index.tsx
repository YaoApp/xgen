import clsx from 'clsx'
import { omit } from 'lodash-es'
import { Else, If, Then } from 'react-if'
import { ReactSortable } from 'react-sortablejs'

import Row from '../Row'
import styles from './index.less'

import type { IPropsList } from '../../types'

const Index = (props: IPropsList) => {
	const { list, parentId, onChange } = props

	return (
		<div
			className={clsx([
				styles._local,
				styles.list_wrap,
				parentId && styles.children_wrap,
				'w_100 border_box flex flex_column'
			])}
		>
			<ReactSortable list={list} handle='.handle' animation={150} setList={(v) => onChange(v, parentId)}>
				{list.map((item) => (
					<If condition={!item.children?.length} key={item.id}>
						<Then>
							<Row dataItem={item}></Row>
						</Then>
						<Else>
							<Row dataItem={omit(item, 'children')}></Row>
							<Index list={item.children} parentId={item.id} onChange={onChange}></Index>
						</Else>
					</If>
				))}
			</ReactSortable>
		</div>
	)
}

export default window.$app.memo(Index)
