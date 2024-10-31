import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AliveScope } from 'react-activation'
import { Else, If, Then } from 'react-if'
import root from 'react-shadow'
import { container } from 'tsyringe'

import { ShadowTheme } from '@/widgets'

import { Empty, List, Styles } from './components'
import Model from './model'

import type { IProps, IPropsList, IPropsEmpty } from './types'
import { use } from 'echarts'

const Index = (props: IProps) => {
	const { setting, list, showLabel, hasChildren, builder, onChangeForm } = props
	const [x] = useState(() => container.resolve(Model))
	const shadowHostRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => x.init(list, setting, onChangeForm), [list])

	const onAdd = useMemoizedFn(x.onAdd)
	const onSort = useMemoizedFn(x.onSort)
	const onAction = useMemoizedFn(x.onAction)
	const onChange = useMemoizedFn(x.onChange)

	const props_list: IPropsList = {
		setting,
		list: toJS(x.list),
		showLabel,
		builder,
		hasChildren,
		onSort,
		onAction,
		onChange
	}

	const props_empty: IPropsEmpty = {
		builder,
		placeholder: props.props?.placeholder || '添加数据项',
		onAdd
	}

	return (
		<root.div ref={shadowHostRef}>
			<ShadowTheme></ShadowTheme>
			<Styles showLabel={showLabel} builder={builder}></Styles>
			<If condition={x.list.length}>
				<Then>
					<AliveScope>
						<List __shadow_host_ref={shadowHostRef} {...props_list}></List>
					</AliveScope>
				</Then>
				<Else>
					<Empty {...props_empty}></Empty>
				</Else>
			</If>
		</root.div>
	)
}

export default new window.$app.Handle(Index).by(observer).get()
