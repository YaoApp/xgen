import { Icon } from '@/widgets'
import { Drawer } from 'antd'
import { Type } from './types'
import { Else, If, Then } from 'react-if'
import Section from './Section'
import styles from './index.less'
import clsx from 'clsx'
import { ReactNode } from 'react'

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
	onClose: () => void
	onChange?: (id: string, bind: string, value: any) => void
	afterOpenChange?: (open: boolean) => void
}

const Index = (props: IProps) => {
	const { id, label, data, type } = props
	const icon =
		typeof type?.icon === 'string'
			? { name: type.icon }
			: typeof type?.icon == 'object'
			? type.icon
			: { name: props.defaultIcon || 'material-format_align_left' }

	const getTitle = () => {
		if (props.actions && props.actions.length > 0) {
			return (
				<div className='flex' style={{ alignItems: 'center', justifyContent: 'space-between' }}>
					<div>
						<Icon size={14} {...icon} className='mr_6' />
						{label}
					</div>
					<div className='flex' style={{ alignItems: 'center', justifyContent: 'end' }}>
						{props.actions.map((action, index) => (
							<div
								className='flex'
								style={{ alignItems: 'center', justifyContent: 'space-between' }}
								key={index}
							>
								{action}
							</div>
						))}
					</div>
				</div>
			)
		}

		return (
			<div className='flex' style={{ alignItems: 'center' }}>
				<Icon size={14} {...icon} className='mr_6' />
				{label}
			</div>
		)
	}

	const onChange = (id: string, bind: string, value: any) => {
		props.onChange && props.onChange(id, bind, value)
	}

	return (
		<Drawer
			title={getTitle()}
			placement='right'
			closable={false}
			maskClosable={true}
			onClose={props.onClose}
			afterOpenChange={props.afterOpenChange}
			open={props.open}
			getContainer={false}
			className={clsx(styles._local)}
			maskClassName='mask'
			width={props.width || '36%'}
			style={{ position: props.fixed ? 'fixed' : 'absolute', zIndex: props.fixed ? 101 : 99 }}
		>
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
