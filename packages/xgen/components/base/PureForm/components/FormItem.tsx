import { useMemoizedFn } from 'ahooks'
import { Col, Popover, Input, Button } from 'antd'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { PaperPlaneTilt } from 'phosphor-react'
import { useMemo, useState, useRef, useEffect } from 'react'

import { X } from '@/components'
import { useGlobal } from '@/context/app'

import styles from '../ai.less'

import type { IPropsFormItem } from '../types'

const { TextArea } = Input

const aiExclude: Record<string, boolean> = {} // AI mapping that does not need to be displayed

const Index = (props: IPropsFormItem) => {
	const { namespace, primary, type, item } = props
	const global = useGlobal()
	const input = useRef<any>(null)
	const [visible, setVisible] = useState(false)
	const [loading, setLoading] = useState(false)

	const unLoading = useMemoizedFn(() => setLoading(false))

	useEffect(() => {
		window.$app.Event.on(`${namespace}/${item.bind}/unloading`, unLoading)

		return () => window.$app.Event.off(`${namespace}/${item.bind}/unloading`, unLoading)
	}, [namespace, item])

	const show_ai = useMemo(
		() => global.app_info.optional?.neo?.api && item.edit?.props?.ai && !aiExclude[item.edit?.type],
		[global.app_info.optional?.neo?.api, item.edit?.props?.ai]
	)

	const disabled_props = useMemo(() => {
		if (type === 'view') return { disabled: true }

		const disabled = item.edit?.props?.disabled

		if (typeof disabled === 'undefined') return {}
		if (typeof disabled === 'string') return { disabled: disabled === 'true' || disabled === '1' }

		return { disabled }
	}, [type, item.edit?.props?.disabled])

	const showAI = useMemoizedFn(() => setVisible(true))

	const askAI = useMemoizedFn((e) => {
		e.preventDefault()

		const target = input?.current?.resizableTextArea?.textArea

		if (!target) return
		if (!target.value) return

		window.$app.Event.emit('app/getField', {
			name: item.name,
			bind: item.bind,
			text: target.value,
			config: item
		})

		setVisible(false)
		setLoading(true)
	})

	const Ask = (
		<div className='field_ask_wrap flex'>
			<TextArea
				className='input_ask'
				placeholder={item.edit?.props?.ai?.placeholder}
				bordered
				autoFocus
				autoSize
				ref={input}
				onPressEnter={askAI}
			></TextArea>
			<div className='btn_confirm flex justify_center align_center clickable' onClick={askAI}>
				<PaperPlaneTilt size={16} weight='bold'></PaperPlaneTilt>
			</div>
		</div>
	)

	const Content = (
		<Col className='form_col_wrap relative' span={item.width}>
			{show_ai && (
				<Popover
					overlayClassName={styles.popover}
					placement='topRight'
					trigger='click'
					getPopupContainer={(n) => n.parentElement!}
					destroyTooltipOnHide
					content={Ask}
					open={visible}
					onOpenChange={(v) => {
						if (!v) setVisible(v)
					}}
				>
					<span
						className={clsx([
							'mark_ai absolute flex justify_center align_center clickable',
							visible && 'visible'
						])}
						onClick={showAI}
					>
						AI
					</span>
				</Popover>
			)}
			{loading && (
				<Button className='ai_loading' type='ghost' size='small' loading>
					<span className='mark_ai'>AI</span>
				</Button>
			)}
			<X
				type='edit'
				name={item.edit?.type || 'Input'}
				props={{
					...item.edit?.props,
					...disabled_props,
					__namespace: namespace,
					__primary: primary,
					__type: type,
					__bind: item.bind,
					__name: item.name,
					__hidelabel: item.edit?.hideLabel || item.hideLabel || undefined
				}}
			></X>
		</Col>
	)

	return Content
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
