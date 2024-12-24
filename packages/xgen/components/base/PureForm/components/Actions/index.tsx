import { useMemoizedFn } from 'ahooks'
import { Affix, Button } from 'antd'
import clsx from 'clsx'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { When } from 'react-if'

import { useAction } from '@/actions'
import { useActionDisabled, useActionStyle } from '@/hooks'
import { getTemplateValue } from '@/utils'
import { Icon } from '@/widgets'

import styles from './index.less'

import type { IPropsActions } from '../../types'
import { useGlobal } from '@/context/app'

const Index = (props: IPropsActions) => {
	const { namespace, primary, type, id, actions, data, disabledActionsAffix } = props
	const [stick, setStick] = useState<boolean | undefined>(false)
	const [loading, setLoading] = useState('')
	const getStyle = useActionStyle()
	const getDisabled = useActionDisabled()
	const onAction = useAction()
	const global = useGlobal()
	const isChat = global.layout === 'Chat'

	const unLoading = useMemoizedFn(() => setLoading(''))
	const offsetTop = 11

	useEffect(() => {
		window.$app.Event.on(`${namespace}/form/actions/done`, unLoading)

		return () => {
			window.$app.Event.off(`${namespace}/form/actions/done`, unLoading)
			unLoading()
		}
	}, [namespace])

	const _actions = useMemo(() => {
		const when_add = id === 0
		const when_view = type === 'view'
		const handle_actions = getTemplateValue(actions!, data || {})
		if (when_add) return handle_actions?.filter((item) => item.showWhenAdd)
		if (when_view) return handle_actions?.filter((item) => item.showWhenView)

		return handle_actions?.filter((item) => !item.hideWhenEdit)
	}, [actions, data, id, type])

	const buttonStyle = isChat
		? {
				fontSize: 13,
				height: 32,
				padding: '0 12px'
		  }
		: {}

	return (
		<Affix
			offsetTop={offsetTop}
			style={{ zIndex: disabledActionsAffix ? 0 : 101 }}
			onChange={(v) => setStick(v)}
		>
			<div
				className={clsx([
					styles._local,
					'w_100 border flex align_center transition_normal',
					stick && styles.stick
				])}
			>
				<div className='flex align_center'>
					{_actions?.map((it, index) => (
						<Fragment key={index}>
							<Button
								className={clsx([
									'btn_action border_box flex justify_center align_center clickable',
									getStyle(it.style),
									getDisabled(it.disabled),
									loading !== '' && 'disabled'
								])}
								style={buttonStyle}
								size={isChat ? 'small' : 'middle'}
								icon={<Icon name={it.icon} size={isChat ? 12 : 15}></Icon>}
								onClick={() => {
									setLoading(`${it.title}-${index}`)
									onAction({
										namespace,
										primary,
										data_item: data,
										it
									})
								}}
								loading={loading === `${it.title}-${index}`}
							>
								{it.title}
							</Button>
							<When condition={it.divideLine}>
								<div className='divide_line'></div>
							</When>
						</Fragment>
					))}
				</div>
			</div>
		</Affix>
	)
}

export default window.$app.memo(Index)
