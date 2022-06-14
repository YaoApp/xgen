import { Tooltip } from 'antd'
import clsx from 'clsx'

import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'

import styles from './index.less'

interface IProps {
	batch: boolean
	selected: Array<string>
	showBatch: () => void
	cancel: () => void
}

const Index = (props: IProps) => {
	const { batch, selected } = props

	return (
		<div className={styles._local}>
			{batch ? (
				<div className='options_group_wrap border_box flex'>
					<a
						className={clsx([
							'option_item btn_confirm flex justify_center align_center transition_normal mr_16',
							!selected.length ? 'disabled' : ''
						])}
					>
						<CheckOutlined className='icon_check' />
						<span className='text ml_6'>选择并编辑</span>
					</a>
					<Tooltip title='取消' placement='bottom'>
						<a className='option_item btn_close flex justify_center align_center'>
							<CloseOutlined />
						</a>
					</Tooltip>
				</div>
			) : (
				<Tooltip title='批量编辑' placement='bottom'>
					<a className='option_item cursor_point flex justify_center align_center transition_normal clickable'>
						<EditOutlined
							className='icon_option'
							style={{ fontSize: 15 }}
						/>
					</a>
				</Tooltip>
			)}
		</div>
	)
}

export default window.$app.memo(Index)
