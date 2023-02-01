import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { container } from 'tsyringe'

import { GlobalContext, GlobalModel } from '@/context/app'

import type { PropsWithChildren } from 'react'

const Index = ({ children }: PropsWithChildren) => {
	const [global] = useState(() => container.resolve(GlobalModel))

	return <GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
