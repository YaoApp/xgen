import { Icon } from '@/widgets'
import { Drawer } from 'antd'
import { Type } from './types'
import { Else, If, Then } from 'react-if'
import Section from './Section'
import styles from './index.less'
import clsx from 'clsx'

interface IProps {
	open: boolean
	id?: string
	label?: string
	data?: Record<string, any>
	type?: Type
	fixed: boolean
	offsetTop: number
	defaultIcon?: string
	onClose: () => void
	onChange?: (id: string, bind: string, value: any) => void
}

const Index = (props: IProps) => {
	const { id, label, data, type } = props
	const icon =
		typeof type?.icon === 'string'
			? { name: type.icon }
			: typeof type?.icon == 'object'
			? type.icon
			: { name: props.defaultIcon || 'material-format_align_left' }

	const Title = (
		<div className='flex' style={{ alignItems: 'center' }}>
			<Icon size={14} {...icon} className='mr_6' />
			{label}
		</div>
	)

	const onChange = (id: string, bind: string, value: any) => {
		props.onChange && props.onChange(id, bind, value)
	}

	return (
		<Drawer
			title={Title}
			placement='right'
			closable={false}
			maskClosable={true}
			onClose={props.onClose}
			open={props.open}
			getContainer={false}
			className={clsx(styles._local)}
			maskClassName='mask'
			style={{ position: props.fixed ? 'fixed' : 'absolute', zIndex: props.fixed ? 101 : 99 }}
		>
			<If condition={type != undefined}>
				<Then>
					{type?.props?.map((section, index) => (
						<Section id={id} key={index} section={section} onChange={onChange} data={data} />
					))}
				</Then>
				<Else> Someting Error </Else>
			</If>
		</Drawer>
	)
}

export default window.$app.memo(Index)
