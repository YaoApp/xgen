import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { List } from './components'
import Model from './model'

import type { IProps, IPropsList } from './types'

const Index = (props: IProps) => {
	const { setting, list, onChangeForm } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init(list)
	}, [list])

      const onChange: IPropsList[ 'onChange' ] = useMemoizedFn((v, parentId) => {
            
      })

	return <List list={toJS(x.list)} onChange={onChange}></List>
}

export default new window.$app.Handle(Index).by(observer).get()
