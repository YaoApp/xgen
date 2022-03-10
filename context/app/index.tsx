import { createContext, useContext } from 'react'

import Model from './model'

export { default as GlobalModel } from './model'

// @ts-ignore Avoid duplicate declarations
export const GlobalContext = createContext<Model>()

export const useGlobal = () => useContext(GlobalContext)
