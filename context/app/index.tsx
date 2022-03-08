import { createContext, useContext } from 'react'

import Model from './model'

import type { PropsWithChildren } from 'react'

// @ts-ignore Avoid duplicate declarations
const Context = createContext<Model>()

export const useGlobal = () => useContext(Context)

const Index = (props: PropsWithChildren<{}>) => {
	const { children } = props

	return <Context.Provider value={new Model()}>{children}</Context.Provider>
}

export default window.$app.memo(Index)
