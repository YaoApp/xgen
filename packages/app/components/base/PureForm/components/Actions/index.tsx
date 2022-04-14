import { Affix, Button } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'

import { useAction, useActionDisabled, useActionStyle } from '@/hooks'
import { Icon } from '@/widgets'

import styles from './index.less'

import type { IPropsActions } from '../../types'

const Index = (props: IPropsActions) => {
	const { locale_messages, namespace, primary, type, operation, data, onBack } = props
	const [stick, setStick] = useState<boolean | undefined>(false)
	const getStyle = useActionStyle()
	const getDisabled = useActionDisabled(data)
	const onAction = useAction()

	return (
		<Affix offsetTop={11} style={{ zIndex: 101 }} onChange={(v) => setStick(v)}>
			<div
				className={clsx([
					styles._local,
					'w_100 border flex align_center transition_normal',
					stick && styles.stick
				])}
			>
				{operation.actions?.length && (
					<div className='custom_actions flex align_center'>
						{operation.actions.map((it, index) => (
							<Button
								className={clsx([
									'btn_action border_box flex justify_center align_center clickable',
									getStyle(it.style),
									getDisabled(it.disabled)
								])}
								icon={<Icon name={it.icon} size={15}></Icon>}
								key={index}
								onClick={() =>
									onAction({
										namespace,
										primary,
										data_item: data,
										it
									})
								}
							>
								{it.title}
							</Button>
						))}
					</div>
				)}
				{operation.preset && (
					<div className='preset_actions flex'>
						<Button
							className='btn_action btn_preset'
							icon={<Icon name='icon-arrow-left' size={15}></Icon>}
							onClick={onBack}
						>
							{locale_messages.back}
						</Button>
						{type === 'edit' && (
							<Button
								className='btn_action'
								type='primary'
								htmlType='submit'
							>
								{locale_messages.save}
							</Button>
						)}
					</div>
				)}
			</div>
		</Affix>
	)
}

export default window.$app.memo(Index)
