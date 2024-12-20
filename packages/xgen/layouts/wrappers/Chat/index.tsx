import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { FC, PropsWithChildren } from 'react'
import { container } from 'tsyringe'
import { GlobalModel } from '@/context/app'

const ChatWrapper: FC<PropsWithChildren> = ({ children }) => {
	const global = container.resolve(GlobalModel)

	const handleToggleLayout = () => {
		global.setLayout('Admin')
	}

	return (
		<div className='chat-wrapper'>
			<div className='chat-header' style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
				<Button onClick={handleToggleLayout}>Switch to Admin</Button>
			</div>
			<div className='chat-content'>{children}</div>
		</div>
	)
}

export default observer(ChatWrapper)
