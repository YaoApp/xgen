import { Tooltip } from 'antd'
import clsx from 'clsx'

import { useActionDisabled, useActionStyle, useOperation } from '@/hooks'
import { Icon } from '@/widgets'

import styles from './index.less'

import type { IPropsActions } from '../../types'

const Index = (props: IPropsActions) => {
	const { namespace, primary, actions, data_item } = props
	const getStyle = useActionStyle()
	const getDisabled = useActionDisabled(data_item)
	const handleOperation = useOperation()

	return (
		<div className={clsx([styles._local, 'flex flex_wrap justify_end'])}>
			{actions.map((it, index) => (
				<Tooltip
					title={it.title}
					key={index}
					overlayClassName={styles.unfold_actions}
					destroyTooltipOnHide={{ keepParent: false }}
					align={{ offset: [0, 6] }}
					autoAdjustOverflow={false}
				>
					<div className='unfold_table_option_item' key={index}>
						<a
							className={clsx([
								'icon_wrap border_box flex justify_center align_center clickable',
								getStyle(it.style),
								getDisabled(it.disabled)
							])}
							onClick={() =>
								handleOperation({
									namespace,
									primary,
									data_item,
									it
								})
							}
						>
							<Icon name={it.icon} size={13}></Icon>
						</a>
					</div>
				</Tooltip>
			))}
		</div>
	)
}

export default window.$app.memo(Index)
