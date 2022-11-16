import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import { container } from 'tsyringe'

import { Empty, Filter, List } from './components'
import Model from './model'

import type { IProps, IPropsFilter, IPropsList } from './types'

const Index = (props: IProps) => {
	const { setting, list, onChangeForm } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => x.init(list), [list])

	const onAdd = useMemoizedFn(x.onAdd)
	const onSort = useMemoizedFn(x.onSort)
	const onAction = useMemoizedFn(x.onAction)

	const props_filter: IPropsFilter = {
		onAdd
	}

	const props_list: IPropsList = {
		list: toJS(x.list),
		onSort,
		onAction
	}

	return (
		<div className='flex flex_column'>
			<Filter {...props_filter}></Filter>
			<If condition={x.list.length}>
				<Then>
					<List {...props_list}></List>
				</Then>
				<Else>
					<Empty></Empty>
				</Else>
			</If>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).get()
