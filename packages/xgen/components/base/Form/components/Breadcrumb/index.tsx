import { Affix, Breadcrumb } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'

import { Link } from '@umijs/max'

import styles from './index.less'

import type { IPropsBreadcrumb } from '../../types'

const { Item } = Breadcrumb

const Index = (props: IPropsBreadcrumb) => {
	const { model, name, title } = props
	const [stick, setStick] = useState<boolean | undefined>(false)

	return (
		<div className={styles._local}>
			<Affix offsetTop={0} onChange={(v) => setStick(v)}>
				<Breadcrumb className={clsx(['bread transition_normal', stick && 'stick'])}>
					<Item>
						<Link to={`/x/Table/${model}`}>{name}</Link>
					</Item>
					<Item>{title}</Item>
				</Breadcrumb>
			</Affix>
		</div>
	)
}

export default window.$app.memo(Index)
