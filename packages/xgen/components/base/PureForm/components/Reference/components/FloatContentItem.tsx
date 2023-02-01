import { useToggle } from 'ahooks'
import { Drawer } from 'antd'
import clsx from 'clsx'
import { Fragment } from 'react'
import { Case, Switch } from 'react-if'

import { X } from '@/components'

import styles from '../index.less'

import type { IPropsReferenceFloatContentItem } from '../../../types'

const Index = (props: IPropsReferenceFloatContentItem) => {
	const { item, container } = props
	const [visible_flat_content, { toggle }] = useToggle(false)

	return (
		<Fragment>
			<button
				className={clsx([
					styles.button,
					styles.float,
					'border_box flex flex_column justify_center align_center cursor_point'
				])}
				onClick={toggle}
			>
				{item.name}
			</button>
			<Drawer
				className={styles.drawer}
				open={visible_flat_content}
				getContainer={container.current!}
				width='81%'
				title={null}
				headerStyle={{ display: 'none' }}
				bodyStyle={{ padding: 0 }}
				push={false}
				placement='right'
				destroyOnClose
				maskClosable
				onClose={toggle}
			>
				<Switch>
					<Case condition={!!item?.payload?.Form}>
						<X
							type='base'
							name='Form'
							props={{
								parent: 'Form',
								model: item?.payload?.Form?.model,
								id: item?.payload?.Form?.id,
								form: { type: item?.payload?.Form?.type },
								onBack: toggle
							}}
						></X>
					</Case>
					<Case condition={!!item?.payload?.Page}></Case>
				</Switch>
			</Drawer>
		</Fragment>
	)
}

export default window.$app.memo(Index)
