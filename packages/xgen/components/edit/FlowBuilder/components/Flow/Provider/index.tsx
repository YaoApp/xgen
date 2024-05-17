import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'
import { Setting } from '../../../types'

interface FlowContextType {
	setting?: Setting
	setSetting?: Dispatch<SetStateAction<Setting | undefined>>

	hideContextMenu?: boolean | undefined
	setHideContextMenu?: Dispatch<SetStateAction<boolean | undefined>>
}

interface IProps {
	children: ReactNode
	setting?: Setting
}

const FlowContext = createContext<FlowContextType | undefined>(undefined)
export const FlowProvider: React.FC<IProps> = (props) => {
	const [setting, setSetting] = useState<Setting | undefined>(props.setting)
	const [hideContextMenu, setHideContextMenu] = useState<boolean | undefined>(undefined)
	return (
		<FlowContext.Provider
			value={{
				setting,
				setSetting,
				hideContextMenu,
				setHideContextMenu
			}}
		>
			{props.children}
		</FlowContext.Provider>
	)
}

export const useFlowContext = (): FlowContextType => {
	const context = useContext(FlowContext)
	if (context === undefined) {
		throw new Error('useFlowContext must be used within a GlobalProvider')
	}
	return context
}
