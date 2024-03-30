import { Icon } from '@/widgets'
import { Drawer } from 'antd'
import { useEffect, useState } from 'react'

interface IProps {
	open: boolean
	onClose: () => void
}

const Index = (props: IProps) => {
	return (
		<Drawer
			title={'xx'}
			placement='right'
			closable={false}
			maskClosable={true}
			onClose={props.onClose}
			open={props.open}
			getContainer={false}
			className='drawer'
			maskClassName='mask'
			style={{ position: 'absolute' }}
		>
			<p>Some contents...</p>
		</Drawer>
	)
}

export default window.$app.memo(Index)
