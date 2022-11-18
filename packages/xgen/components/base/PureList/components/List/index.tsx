import KeepAlive from 'react-activation'
import { Else, If, Then, When } from 'react-if'
import { ReactSortable } from 'react-sortablejs'

import Row from '../Row'

import type { IPropsList } from '../../types'

const Index = (props: IPropsList) => {
	const { setting, list, showLabel, parentIds = [], onSort, onAction } = props

	return (
		<div className='w_100 border_box flex flex_column' style={{ paddingLeft: parentIds?.length && 48 }}>
			<ReactSortable list={list} handle='.handle' animation={150} setList={(v) => onSort(v, parentIds)}>
				{list.map((item) => (
					<If condition={!item.children?.length} key={item.id}>
						<Then>
							<Row
								setting={setting}
								showLabel={showLabel}
								dataItem={item}
								parentIds={[...parentIds, item.id]}
								fold={item?._fold}
								onAction={onAction}
							></Row>
						</Then>
						<Else>
							<div className='w_100 flex flex_column'>
								<Row
									setting={setting}
									showLabel={showLabel}
									dataItem={item}
									parentIds={[...parentIds, item.id]}
									fold={item?._fold}
									onAction={onAction}
								></Row>
								<When condition={!item?._fold}>
									<KeepAlive cacheKey={item.id + [...parentIds, item.id].join('_')}>
										<Index
											setting={setting}
											list={item.children}
											showLabel={showLabel}
											parentIds={[...parentIds, item.id]}
											onSort={onSort}
											onAction={onAction}
										></Index>
									</KeepAlive>
								</When>
							</div>
						</Else>
					</If>
				))}
			</ReactSortable>
		</div>
	)
}

export default window.$app.memo(Index)
