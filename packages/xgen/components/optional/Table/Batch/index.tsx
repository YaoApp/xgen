import { Tooltip } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'

import { CloseOutlined, EditOutlined } from '@ant-design/icons'

import Modal from './components/Modal'
import styles from './index.less'

import type { TableType, Common } from '@/types'

export interface IProps {
	namespace: string
	columns: Array<Common.Column>
	deletable: boolean
	batch: TableType.Batch
	setBatchActive: (v: boolean) => void
}

const Index = (props: IProps) => {
	const { namespace, columns, deletable, batch, setBatchActive } = props
	const [visible_modal, setVisibleModal] = useState(false)

	const props_modal = {
		namespace,
		columns,
		deletable,
		visible_modal,
		setBatchActive,
		setVisibleModal
	}

	return (
		<div className={styles._local}>
			<Modal {...props_modal}></Modal>
			{batch.active ? (
				<div className='options_group_wrap border_box flex'>
					<a
						className={clsx([
							'btn_confirm flex justify_center align_center transition_normal',
							!batch.selected.length ? 'disabled' : ''
						])}
						onClick={() => setVisibleModal(true)}
					>
						<span className='no_wrap'>选择并编辑</span>
					</a>
					<Tooltip title='取消' placement='bottom'>
						<a
							className='btn_close flex justify_center align_center'
							onClick={() => setBatchActive(false)}
						>
							<CloseOutlined />
						</a>
					</Tooltip>
				</div>
			) : (
				<Tooltip title='批量编辑' placement='bottom'>
					<a
						className='option_item cursor_point flex justify_center align_center transition_normal clickable'
						onClick={() => setBatchActive(true)}
					>
						<EditOutlined className='icon_option' style={{ fontSize: 15 }} />
					</a>
				</Tooltip>
			)}
		</div>
	)
}

export default window.$app.memo(Index)
