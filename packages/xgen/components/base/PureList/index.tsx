import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import Model from './model'

import type { IProps } from './types'

const Index = (props: IProps) => {
	const { setting, list, onChange } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init(list)
	}, [list])

	console.log(props)

      return <div className={ clsx([ 'w_100 flex flex_column' ]) }>
            
      </div>
}

export default new window.$app.Handle(Index).by(observer).get()
