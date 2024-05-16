import clsx from 'clsx'
import { FC } from 'react'
import { NodeProps, Handle, Position, NodeToolbar } from 'reactflow'
import styles from './index.less'
import { Icon } from '@/widgets'
import { Color } from '@/utils'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { getLocale } from '@umijs/max'
import { useGlobal } from '@/context/app'

const CustomNode: FC<NodeProps> = ({ data }) => {
	const global = useGlobal()
	const is_cn = getLocale() === 'zh-CN'
	const events = data.events || {}

	// Default values
	data.showSourceHandle = data.showSourceHandle === undefined ? true : data.showSourceHandle
	data.showTargetHandle = data.showTargetHandle === undefined ? true : data.showTargetHandle
	data.toolbarVisible = data.toolbarVisible === undefined ? true : data.toolbarVisible
	data.toolbarPosition = data.toolbarPosition === undefined ? Position.Bottom : data.toolbarPosition
	data.toolbarAlign = data.toolbarAlign === undefined ? 'end' : data.toolbarAlign
	const color = data.color && data.color != '' ? Color(data.color, global.theme) : Color('text', global.theme)
	data.icon = data.icon || { name: 'material-trip_origin', size: 16 }

	const onSetting = (event: any) => {
		event.stopPropagation()
		events.onSetting && events.onSetting(data.id)
	}

	const onDelete = (event: any) => {
		event.stopPropagation()
		events.onDelete && events.onDelete(data.id)
	}

	const onDuplicate = (event: any) => {
		event.stopPropagation()
		events.onDuplicate && events.onDuplicate(data.id)
	}

	const onAdd = (event: any) => {
		event.stopPropagation()
		events.onAdd && events.onAdd(data.id)
	}

	return (
		<>
			<NodeToolbar
				className={clsx(styles._toolbar)}
				isVisible={data.toolbarVisible}
				position={data.toolbarPosition}
				align={data.toolbarAlign}
			>
				<a className='item' onClick={onDuplicate}>
					<Icon name='material-content_copy' size={16} />
				</a>
				<a className='item' onClick={onSetting}>
					<Icon name='material-settings' size={16} />
				</a>
				<a className='item' style={{ marginRight: 16 }} onClick={onDelete}>
					<Icon name='material-delete' size={16} />
				</a>
				<a className='item' onClick={onAdd}>
					<Icon name='material-add' size={16} />
				</a>
			</NodeToolbar>

			{data.error && (
				<div className={clsx(styles._error)}>
					<div className='icon'>
						<Icon name='material-cancel' size={16} />
					</div>
					<div className='message'>{data.error}</div>
				</div>
			)}
			<div className={clsx([styles._type])}>
				{data.icon && (
					<Icon
						name={data.icon?.name ? data.icon?.name : data.icon}
						style={{ marginRight: 4 }}
						color={color}
						size={data.icon?.size ? data.icon?.size : 16}
					/>
				)}
				<div style={{ color: color }}>{data.typeLabel || data.type}</div>
			</div>

			<div className={clsx([styles._label, 'flex align_center label'])}>
				{data.icon && data.running !== true && (
					<Icon
						name={data.icon?.name ? data.icon?.name : data.icon}
						style={{ marginRight: 4 }}
						size={data.icon?.size ? data.icon?.size : 16}
					/>
				)}
				{data.running === true && (
					<Spin
						size='small'
						style={{ marginRight: 4 }}
						spinning={true}
						indicator={
							<LoadingOutlined className='running-icon' style={{ fontSize: 16 }} spin />
						}
					/>
				)}
				<div className='description' style={{ textAlign: 'left' }}>
					{data.label || data.description}
				</div>
			</div>

			{data.showTargetHandle && <Handle type='target' position={Position.Left} />}
			{data.showSourceHandle && <Handle type='source' position={Position.Right} />}
		</>
	)
}

export default CustomNode
