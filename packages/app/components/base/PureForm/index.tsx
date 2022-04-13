import { Col, Form, Row, Tabs } from 'antd'
import clsx from 'clsx'

import { X } from '@/components'

import Actions from './components/Actions'
import Sections from './components/Sections'
import styles from './index.less'

import type { IPropsPureForm, IPropsActions, IPropsSections } from './types'
import type { Common, FormType } from '@/types'

const { useForm } = Form
const { TabPane } = Tabs

const getTabs = (item: FormType.TargetTab, key: number) => {
	return (
		<Col span={item.width} key={key}>
			<Tabs className='w_100' style={{ padding: '0 8px' }} animated>
				{item.tabs.map((it, idx: number) => (
					<TabPane tab={it.title} key={key + idx} forceRender>
						<Row gutter={24} wrap={true}>
							{it.columns.map((i, k: number) => {
								if ('tabs' in i) {
									return getTabs(i, key + idx + k)
								} else {
									return getFormItem(i, key + idx + k)
								}
							})}
						</Row>
					</TabPane>
				))}
			</Tabs>
		</Col>
	)
}

const getFormItem = (item: Common.Column, key: number) => {
	return (
		<Col span={item.width} key={key}>
			<X
				type='edit'
				name={item.edit.type}
				props={{
					...item.edit.props,
					__bind: item.bind,
					__name: item.name
				}}
			></X>
		</Col>
	)
}

const Index = (props: IPropsPureForm) => {
	const { namespace, primary, data, sections, operation, title } = props
	const [form] = useForm()

	const props_actions: IPropsActions = {}

	const props_sections: IPropsSections = {
		sections
	}

	return (
		<Form className={clsx([styles._local])} form={form} name={namespace}>
			<div className='form_title_wrap w_100 border_box flex justify_between align_center'>
				<span className='title no_wrap'>{title}</span>
				<Actions {...props_actions}></Actions>
			</div>
			<div className='form_wrap w_100 border_box'>
				{sections.map((item, index) => (
					<div
						className='section w_100 border_box flex flex_column'
						key={index}
					>
						{item.title && (
							<a
								id={item.title}
								className='section_title_wrap flex flex_column disabled'
								href={`#${item.title}`}
							>
								<span className='section_title'>{item.title}</span>
								{item.desc && (
									<span className='desc'>{item.desc}</span>
								)}
							</a>
						)}
						<Row gutter={24} wrap={true}>
							{item.columns.map((it, idx) => {
								if ('tabs' in it) {
									return getTabs(it, index + idx)
								} else {
									return getFormItem(it, index + idx)
								}
							})}
						</Row>
					</div>
				))}
			</div>
		</Form>
	)
}

export default window.$app.memo(Index)
