import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import styles from './index.less'
import Model from './model'

import type { Component } from '@/types'

const Index = (props: Component.StackComponent) => {
	const { parent, model, id, form } = props
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init(parent, model, id, form)

		return () => {
			x.off()
		}
	}, [x, parent, model, id, form])

	if (!x.setting.form) return null

	return <div className={clsx([styles._local])}>123</div>
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
