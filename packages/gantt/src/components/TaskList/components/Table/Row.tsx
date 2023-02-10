import { useMemo } from 'react'

import type { IPropsTableRow } from '../../types'

const Index = (props: IPropsTableRow) => {
	const { item, rowHeight, rowWidth, onExpanderClick, toLocaleDateString } = props
	const { id, name, hideChildren, start, end } = item

	const expanderSymbol = useMemo(() => (hideChildren ? '▶' : '▼'), [hideChildren])

	return (
		<div className='taskListTableRow' style={{ height: rowHeight }} key={`${id}row`}>
			<div className='taskListCell' style={{ minWidth: rowWidth, maxWidth: rowWidth }} title={name}>
				<div className='taskListNameWrapper'>
					<div
						className={expanderSymbol ? 'taskListExpander' : 'taskListEmptyExpander'}
						onClick={() => onExpanderClick(item)}
					>
						{expanderSymbol}
					</div>
					<div>{name}</div>
				</div>
			</div>
			<div className='taskListCell' style={{ minWidth: rowWidth, maxWidth: rowWidth }}>
				&nbsp;{toLocaleDateString(start)}
			</div>
			<div className='taskListCell' style={{ minWidth: rowWidth, maxWidth: rowWidth }}>
				&nbsp;{toLocaleDateString(end)}
			</div>
		</div>
	)
}

export default Index
