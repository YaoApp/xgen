import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import Common from '@/pages/login/components/Common'
import Model from '@/pages/login/model'
import { history, useParams } from '@umijs/max'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const { is } = useParams<{ is: string }>()

	useLayoutEffect(() => {
		if (!x.global.app_info.login?.user) return history.push('/login/admin')

		x.user_type = 'user'
		x.is = is

		x.on()

		return () => x.off()
	}, [])

	return <Common type='user' x={x}></Common>
}

export default new window.$app.Handle(Index).by(observer).get()
