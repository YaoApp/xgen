import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import Common from '@/pages/login/components/Common'
import Model from '@/pages/login/model'
import { history, useParams } from '@umijs/max'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const { is } = useParams<{ is: string }>()
	const query = new URLSearchParams(history.location.search)

	useLayoutEffect(() => {
		if (!x.global.app_info.login?.user) return history.push('/login/admin')

		x.user_type = 'user'
		x.is = is
		x.getCaptcha()
	}, [])

	useLayoutEffect(() => {
		if (!query.get('from')) return

		x.loginByLark({
			code: query.get('code') as string,
			state: query.get('state') as string
		})
	}, [query])

	return <Common type='user' x={x}></Common>
}

export default new window.$app.Handle(Index).by(observer).get()
