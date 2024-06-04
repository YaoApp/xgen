import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import { NodeProps, Handle, Position, NodeToolbar } from 'reactflow'
import styles from './index.less'
import { Icon } from '@/widgets'
import { Color } from '@/utils'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { getLocale } from '@umijs/max'
import { useGlobal } from '@/context/app'
import Types from '../Types'
import { useBuilderContext } from '../../Builder/Provider'

type IProps = {
	id: string
	data: { props?: Record<string, any>; [key: string]: any }
}

const CustomNode: FC<NodeProps> = ({ id, data }: IProps) => {
	const { onDelete, onAdd, onDuplicate, onSettingNode, running, setNodes } = useBuilderContext()

	data.showSourceHandle = data.showSourceHandle === undefined ? true : data.showSourceHandle
	data.showTargetHandle = data.showTargetHandle === undefined ? true : data.showTargetHandle
	data.toolbarVisible = data.toolbarVisible === undefined ? true : data.toolbarVisible
	data.toolbarPosition = data.toolbarPosition === undefined ? Position.Bottom : data.toolbarPosition
	data.toolbarAlign = data.toolbarAlign === undefined ? 'end' : data.toolbarAlign
	data.icon = data.icon || { name: 'material-trip_origin', size: 16 }

	const global = useGlobal()
	const color = data.color && data.color != '' ? Color(data.color, global.theme) : Color('text', global.theme)

	return (
		<>
			{!running && (
				<NodeToolbar
					className={clsx(styles._toolbar)}
					isVisible={data.toolbarVisible}
					position={data.toolbarPosition}
					align={data.toolbarAlign}
				>
					<a className='item' onClick={() => onDuplicate(id)}>
						<Icon name='material-content_copy' size={16} />
					</a>
					<a
						className='item'
						onClick={() => {
							setNodes((nodes) => {
								return nodes.map((node) => {
									if (node.id === id) {
										node.selected = true
									}
									return node
								})
							})
							onSettingNode(id)
						}}
					>
						<Icon name='material-settings' size={16} />
					</a>

					{(data.deletable === undefined || data.deletable === true) && (
						<a className='item' style={{ marginRight: 16 }} onClick={() => onDelete(id)}>
							<Icon name='material-delete' size={16} />
						</a>
					)}

					<Types onAdd={(type: string) => onAdd(id, type)} />
				</NodeToolbar>
			)}

			{data.error && (
				<div className={clsx(styles._error)}>
					<div className='icon'>
						<Icon name='material-cancel' size={16} />
					</div>
					<div className='message'>{data.error}</div>
				</div>
			)}
			<div
				className={clsx([styles._type])}
				onMouseDown={(event) => {
					event.stopPropagation()
					setNodes((nodes) => {
						return nodes.map((node) => {
							if (node.id === id) {
								node.selected = true
							}
							return node
						})
					})
					onSettingNode(id)
				}}
			>
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

			<div className={clsx([styles._label, 'flex align_center label item-drag-handle'])}>
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
					{data.props?.label || data.props?.description}
				</div>
			</div>

			{data.showTargetHandle && <Handle type='target' position={Position.Left} />}
			{data.showSourceHandle && <Handle type='source' position={Position.Right} />}
		</>
	)
}

export default window.$app.memo(CustomNode)
