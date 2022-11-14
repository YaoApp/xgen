import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import { container } from 'tsyringe'

import { useMounted } from '@/hooks'

import { Empty, Filter, Head, List } from './components'
import Model from './model'
import { updateChildren } from './utils'

import type { IProps, IPropsList } from './types'

const Index = (props: IProps) => {
	const { setting, list, onChangeForm } = props
	const [x] = useState(() => container.resolve(Model))
	const mounted = useMounted()

	useLayoutEffect(() => {
		x.init(list)
	}, [list])

	const onChange: IPropsList['onChange'] = useMemoizedFn((v, parentIds) => {
		console.log(v, parentIds)
		const list = v.filter((v) => v)

		if (!parentIds?.length) {
			x.list = list
		} else {
			x.list = updateChildren(x.list, v, parentIds)
		}
	})

	return (
		<div className='flex flex_column'>
			<Filter></Filter>
			<Head></Head>
			<If condition={x.list.length}>
				<Then>
					<List list={toJS(x.list)} onChange={onChange}></List>
				</Then>
				<Else>
					<Empty></Empty>
				</Else>
			</If>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).get()
