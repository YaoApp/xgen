import { Icon } from '@/widgets'
import { Drawer, Form } from 'antd'
import { Field, Type } from '../../types'
import { Else, If, Then } from 'react-if'
import Section from '../Section'

interface IProps {
	open: boolean
	id?: string
	field?: Field
	type?: Type
	fixed: boolean
	offsetTop: number
	onClose: () => void
	onChange?: (id: string, bind: string, value: any) => void
}

const Index = (props: IProps) => {
	const { id, field, type } = props
	const label = field?.props?.label || field?.props?.name || type?.label || 'Untitled'
	const Title = (
		<div className='flex' style={{ alignItems: 'center' }}>
			<Icon size={14} name={type?.icon ? type.icon : 'material-format_align_left'} className='mr_6' />
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
			className='drawer'
			maskClassName='mask'
			style={{ position: props.fixed ? 'fixed' : 'absolute', zIndex: props.fixed ? 101 : 99 }}
		>
			<If condition={field != undefined && type != undefined}>
				<Then>
					{type?.props?.map((section, index) => (
						<Section
							id={id}
							key={index}
							section={section}
							onChange={onChange}
							data={field?.props}
						/>
					))}
				</Then>
				<Else> Someting Error </Else>
			</If>
		</Drawer>
	)
}

export default window.$app.memo(Index)
