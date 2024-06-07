import { Icon } from '@/widgets'
import { Drawer } from 'antd'
import { Type } from './types'
import { Else, If, Then } from 'react-if'
import Section from './Section'
import styles from './index.less'
import clsx from 'clsx'
import { ReactNode, useEffect, useState } from 'react'

interface IProps {
	open: boolean
	id?: string
	label?: string
	actions?: ReactNode[]
	data?: Record<string, any>
	type?: Type
	width?: number | string
	fixed: boolean
	offsetTop: number
	defaultIcon?: string
	icon?: string
	mask?: boolean
	onClose: () => void
	onChange?: (id: string, bind: string, value: any) => void
	afterOpenChange?: (open: boolean) => void
	children?: ReactNode
}

const Index = (props: IProps) => {
	const { id, label, type } = props
	const [data, setData] = useState(props.data)
	let icon = { name: props.defaultIcon || 'material-format_align_left' }
	if (type?.icon) {
		icon = typeof type.icon === 'string' ? { name: type.icon } : type.icon
	}

	if (props.icon) {
		icon = { name: props.icon }
	}
	const getTitle = () => {
		return (
			<div className='flex' style={{ alignItems: 'center', justifyContent: 'space-between' }}>
				<div className='flex' style={{ alignItems: 'center' }}>
					<Icon size={14} {...icon} className='mr_6' />
					{label}
				</div>
				<div className='flex' style={{ alignItems: 'center', justifyContent: 'end' }}>
					{props.actions?.map((action, index) => (
						<div
							className='flex'
							style={{ alignItems: 'center', justifyContent: 'space-between' }}
							key={index}
						>
							{action}
						</div>
					))}

					{!props.mask && (
						<a className='flex' style={{ cursor: 'pointer' }} onClick={props.onClose}>
							<Icon size={18} name='icon-x' className='ml_12' />
						</a>
					)}
				</div>
			</div>
		)
	}

	const onChange = (id: string, bind: string, value: any) => {
		props.onChange && props.onChange(id, bind, value)
	}

	useEffect(() => {
		if (props.data === undefined) return

		const data = { ...props.data }
		type?.props?.forEach((section) => {
			section.columns.forEach((column) => {
				const bind = column.component?.bind
				if (
					bind &&
					props.data?.[bind] === undefined &&
					column.component?.edit?.props?.defaultValue !== undefined
				) {
					data[bind] = column.component?.edit?.props?.defaultValue
					props.onChange && props.onChange(id || '', bind, data[bind])
				}
			})
		})

		setData(props.data)
	}, [props.data])

	return (
		<Drawer
			title={getTitle()}
			placement='right'
			closable={false}
			maskClosable={true}
			mask={!props.mask ? false : true}
			onClose={props.onClose}
			afterOpenChange={props.afterOpenChange}
			open={props.open}
			getContainer={false}
			className={clsx(styles._local)}
			maskClassName='mask'
			width={props.width || '36%'}
			style={{ position: props.fixed ? 'fixed' : 'absolute', zIndex: props.fixed ? 101 : 99 }}
		>
			<If condition={props.children != undefined}>
				<Then>{props.children}</Then>
			</If>
			<If condition={type != undefined}>
				<Then>
					{type?.props?.map((section, index) => (
						<Section id={id} key={index} section={section} onChange={onChange} data={data} />
					))}
				</Then>
			</If>
		</Drawer>
	)
}

export default window.$app.memo(Index)
