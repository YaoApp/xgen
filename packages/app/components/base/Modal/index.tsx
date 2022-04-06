import { Modal } from 'antd'
import { useState } from 'react'

import styles from './index.less'

import type { IConfigCommonOpenModal, IPropsComponent } from '@/types'

export interface IProps {
	namespace: IPropsComponent['__namespace']
	primary: IPropsComponent['__primary']
	config: IConfigCommonOpenModal
}

const Index = (props: IProps) => {
	const { namespace, primary, config } = props
	const [visible, setVisible] = useState(true)

	const modal_container = document.getElementById('__modal_container')!

	const onCancel = () => {
		setVisible(false)

		modal_container.remove()
	}

	return (
		<Modal
			visible={visible}
			onCancel={onCancel}
			getContainer={modal_container}
			destroyOnClose
		>
			<div>{namespace}</div>
		</Modal>
	)
}

export default Index
