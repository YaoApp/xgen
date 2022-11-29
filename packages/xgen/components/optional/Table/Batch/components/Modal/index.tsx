import { Button, Checkbox, Col, Form, Modal, Row } from 'antd'
import { cloneDeep, pickBy } from 'lodash-es'
import { toJS } from 'mobx'

import { X } from '@/components'

import { useOptions } from './hooks'
import styles from './index.less'

import type { IProps as IPropsBatch } from '../../index'

const { confirm } = Modal
const { useForm } = Form

interface IProps extends Omit<IPropsBatch, 'batch'> {
	visible_modal: boolean
	setVisibleModal: (v: boolean) => void
}

const Index = (props: IProps) => {
	const { namespace, columns, deletable, visible_modal, setBatchActive, setVisibleModal } = props
	const { options, setOptions } = useOptions(columns)
	const [form] = useForm()
	const { getFieldsValue } = form

	const onChange = (index: number, checked: boolean) => {
		const _options = cloneDeep(options)

		_options[index].checked = checked

		setOptions(_options)
	}

	const onOk = () => {
		const v = pickBy(getFieldsValue())

		if (!Object.keys(v).length) return

		window.$app.Event.emit(`${namespace}/batchUpdate`, v)

		setBatchActive(false)
	}

	const onDelete = () => {
		window.$app.Event.emit(`${namespace}/batchDelete`)

		setBatchActive(false)
	}

	const Footer = (
		<div className='flex w_100 justify_between'>
			<div className='left_options'>
				{deletable && (
					<Button
						danger
						onClick={() =>
							confirm({
								title: '确认进行批量删除',
								content: '删除之后数据不可恢复，请谨慎操作！',
								centered: true,
								onOk: onDelete
							})
						}
					>
						批量删除
					</Button>
				)}
			</div>
			<div className='right_options'>
				<Button onClick={() => setVisibleModal(false)}>取消</Button>
				<Button type='primary' onClick={onOk}>
					确定
				</Button>
			</div>
		</div>
	)

	return (
		<Modal
			wrapClassName={styles.modal_batch}
			open={visible_modal}
                  title='批量编辑'
                  onCancel={() => setVisibleModal(false)}
			footer={Footer}
                  centered
                  destroyOnClose
		>
			<div className='select_wrap w_100 border_box flex flex_wrap'>
				{options.map((item, index) => (
					<Checkbox
						key={item.name}
						onChange={({ target: { checked } }) => onChange(index, checked)}
					>
						{item.name}
					</Checkbox>
				))}
			</div>
			<Form className='form_batch' name={`form_batch_${namespace}`} form={form} layout='vertical'>
				<Row gutter={16} wrap={true}>
					{options.map(
						(item, index) =>
							item.checked && (
								<Col span={item.width} key={index}>
									<X
										type='edit'
										name={item.edit.type}
										props={{
											...toJS(item.edit.props),
											__bind: item.bind,
											__name: item.name
										}}
									></X>
								</Col>
							)
					)}
				</Row>
			</Form>
		</Modal>
	)
}

export default window.$app.memo(Index)
