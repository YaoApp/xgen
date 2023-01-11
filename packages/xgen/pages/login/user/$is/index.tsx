import { useAsyncEffect } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { container } from 'tsyringe'

import Common from '@/pages/login/components/Common'
import Model from '@/pages/login/model'
import { history, useParams } from '@umijs/max'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const { is } = useParams<{ is: string }>()

	useAsyncEffect(async () => {
		await window.$app.Event.emit('app/getAppInfo')

		if (!x.global.app_info.login?.user) return history.push('/login/admin')

		x.user_type = 'user'
		x.is = is

		x.getCaptcha()
	}, [])

	return <Common type='user' x={x}></Common>
}

export default new window.$app.Handle(Index).by(observer).get()
