import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import Common from '../components/Common'
import Model from '../model'

const Index = () => {
	const [x] = useState(() => new Model())

	return <Common></Common>
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
