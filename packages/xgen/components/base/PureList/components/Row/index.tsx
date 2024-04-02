import Actions from '../Actions'
import Builder from '../Actions/Builder'
import Fields from '../Fields'

import type { IPropsRow } from '../../types'
import { Else, If, Then } from 'react-if'

const Index = (props: IPropsRow) => {
	const { setting, showLabel, builder, hasChildren, dataItem, parentIds, fold, onAction, onChange } = props
	return (
		<div className='w_100 flex align_start' style={builder ? { alignItems: 'center' } : {}}>
			<Fields {...{ builder, setting, showLabel, hasChildren, dataItem, parentIds, onChange }}></Fields>
			<If condition={builder == true}>
				<Then>
					<Builder
						{...{ hasChildren, parentIds, fold, onAction }}
						showFoldAction={dataItem?.children?.length > 0}
					></Builder>
				</Then>
				<Else>
					<Actions
						{...{ hasChildren, parentIds, fold, onAction }}
						showFoldAction={dataItem?.children?.length > 0}
					></Actions>
				</Else>
			</If>
		</div>
	)
}

export default window.$app.memo(Index)
