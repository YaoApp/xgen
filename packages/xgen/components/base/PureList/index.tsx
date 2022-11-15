import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import { container } from 'tsyringe'

import { Empty, Filter, List } from './components'
import Model from './model'
import { createId, handleChildren, updateChildren } from './utils'

import type { IProps, IPropsFilter, IPropsList, ParentIds } from './types'

const Index = (props: IProps) => {
	const { setting, list, onChangeForm } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init(list)
	}, [list])

	const onChange: IPropsList['onChange'] = useMemoizedFn((v, parentIds) => {
		const list = v.filter((v) => v)

		if (!parentIds?.length) {
			x.list = list
		} else {
			x.list = updateChildren(x.list, v, parentIds)
		}
	})

	const onFold = useMemoizedFn((parentIds: ParentIds) => {
		x.list = handleChildren(x.list, 'fold', parentIds)
	})
	const onAdd = useMemoizedFn((parentIds: ParentIds) => {
		if (!parentIds.length) return x.list.push({ id: createId() })

		x.list = handleChildren(x.list, 'add', parentIds)
	})
	const onAddChild = useMemoizedFn((parentIds: ParentIds) => {
		x.list = handleChildren(x.list, 'addChild', parentIds)
	})
	const onRemove = useMemoizedFn((parentIds: ParentIds) => {
		x.list = handleChildren(x.list, 'remove', parentIds)
	})

	const onAction: IPropsList['onAction'] = useMemoizedFn((type, parentIds) => {
		switch (type) {
			case 'fold':
				onFold(parentIds)
				break
			case 'add':
				onAdd(parentIds)
				break
			case 'addChild':
				onAddChild(parentIds)
				break
			case 'remove':
				onRemove(parentIds)
				break
			default:
				break
		}
	})

	const props_filter: IPropsFilter = {
		onAdd
	}

	const props_list: IPropsList = {
		list: toJS(x.list),
		onChange,
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
