import { useClickAway } from 'ahooks'
import { Drawer } from 'antd'
import clsx from 'clsx'
import { useRef } from 'react'

import { useMounted } from '@/hooks'

import styles from './index.less'

import type { IPropsModalWrap } from '../types'

const Index = (props: IPropsModalWrap) => {
	const { children, width, visible, config, onBack } = props
	const ref = useRef<HTMLDivElement>(null)
	const mounted = useMounted()
	const mask = config.byDrawer?.mask || false

	useClickAway(() => {
		if (mounted && !mask) onBack()
	}, ref)

	return (
		<Drawer
			className={clsx([styles._local, 'fixed'])}
			width='auto'
			open={visible}
			mask={mask}
			push={false}
			onClose={onBack}
			destroyOnClose
			footer={false}
			closable={false}
			maskClosable={true}
			getContainer={false}
			bodyStyle={{ padding: 0 }}
		>
			<div className='__open_modal_content_wrap' style={{ width }} ref={ref}>
				{children}
			</div>
		</Drawer>
	)
}

export default window.$app.memo(Index)
