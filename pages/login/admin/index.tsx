import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { container } from 'tsyringe'

import Common from '../components/Common'
import Model from '../model'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))

	x.user_type = 'admin'

	return <Common type='admin' x={x}></Common>
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
