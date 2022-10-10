import { Button, Col } from 'antd'
import clsx from 'clsx'
import { Fragment } from 'react'

import { useAction } from '@/hooks'
import { Icon } from '@/widgets'

import type { IPropsActions } from '../../types'

const Index = (props: IPropsActions) => {
	const { actions } = props
	const onAction = useAction()

	return (
		<Fragment>
			{actions?.map((it, index) => (
				<Button
					className={clsx([
						'btn_action border_box flex justify_center align_center clickable ml_16'
					])}
					type='primary'
					icon={<Icon name={it.icon} size={15}></Icon>}
					key={index}
					onClick={() =>
						onAction({
							namespace: '',
							primary: '',
							data_item: null,
							it
						})
					}
				>
					{it.title}
				</Button>
			))}
		</Fragment>
	)
}

export default window.$app.memo(Index)
