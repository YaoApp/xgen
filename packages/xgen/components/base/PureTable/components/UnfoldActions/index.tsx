import { Tooltip } from 'antd'
import clsx from 'clsx'
import { useMemo } from 'react'

import { useAction } from '@/actions'
import { useActionDisabled, useActionStyle } from '@/hooks'
import { getTemplateValue } from '@/utils'
import { Icon } from '@/widgets'

import styles from './index.less'

import type { IPropsActions } from '../../types'

const Index = (props: IPropsActions) => {
	const { namespace, primary, actions, data_item } = props
	const getStyle = useActionStyle()
	const getDisabled = useActionDisabled()
	const onAction = useAction()

      const _actions = useMemo(() => getTemplateValue(actions, data_item), [ actions, data_item ])

	return (
		<div className={clsx([styles._local, 'flex justify_end'])}>
			{_actions.map((it, index) => (
				<Tooltip
					title={it.title}
					key={index}
					overlayClassName={styles.unfold_actions}
					destroyTooltipOnHide={{ keepParent: false }}
					align={{ offset: [0, 6] }}
					autoAdjustOverflow={false}
				>
					<div className='unfold_table_option_item'>
						<a
							className={clsx([
								'icon_wrap border_box flex justify_center align_center clickable',
								getStyle(it.style),
								getDisabled(it.disabled)
							])}
							onClick={() =>
								onAction({
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
