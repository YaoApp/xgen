import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { container } from 'tsyringe'

import Common from '@/parts/login/components/Common'
import Model from '@/parts/login/model'
import { history, useParams } from '@umijs/max'

const Index = () => {
	const { is } = useParams<{ is: string }>()
	const query = new URLSearchParams(history.location.search)
	const [x] = useState(() => container.resolve(Model))

	useEffect(() => {
		x.user_type = 'user'
		x.is = is
	}, [])

	useEffect(() => {
		if (!query.get('from')) return

		x.loginByLark({
			code: query.get('code') as string,
			state: query.get('state') as string
		})
	}, [query])

	return <Common type='user' x={x}></Common>
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
