import KeepAlive from 'react-activation'
import { When } from 'react-if'
import { ReactSortable } from 'react-sortablejs'

import Row from '../Row'

import type { IPropsList } from '../../types'

const Index = (props: IPropsList) => {
	const {
		setting,
		list,
		showLabel,
		builder,
		hasChildren,
		__shadow_host_ref,
		parentIds = [],
		onSort,
		onAction,
		onChange
	} = props
	return (
		<div className='w_100 border_box flex flex_column' style={{ paddingLeft: parentIds?.length && 48 }}>
			<ReactSortable list={list} handle='.handle' animation={150} setList={(v) => onSort(v, parentIds)}>
				{list.map((item) => (
					<div className='w_100 flex flex_column' key={item.id}>
						<Row
							setting={setting}
							showLabel={showLabel}
							builder={builder}
							hasChildren={hasChildren}
							dataItem={item}
							parentIds={[...parentIds, item.id]}
							__shadow_host_ref={__shadow_host_ref}
							fold={item?._fold}
							onAction={onAction}
							onChange={onChange}
						></Row>
						<When condition={!item?._fold && item.children?.length}>
							<KeepAlive cacheKey={item.id + [...parentIds, item.id].join('_')}>
								<Index
									setting={setting}
									list={item.children}
									showLabel={showLabel}
									builder={builder}
									hasChildren={hasChildren}
									parentIds={[...parentIds, item.id]}
									onSort={onSort}
									onAction={onAction}
									onChange={onChange}
								></Index>
							</KeepAlive>
						</When>
					</div>
				))}
			</ReactSortable>
		</div>
	)
}

export default window.$app.memo(Index)
