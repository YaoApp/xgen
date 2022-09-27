import { Anchor } from 'antd'
import { Fragment } from 'react'

import type { IPropsAnchorItem } from '../types'

const { Link } = Anchor

const Index = ({ item }: IPropsAnchorItem) => {
	if ('tabs' in item) {
		return (
			<Fragment>
				{item.tabs.map((i, k) => (
					<Link title={i.title} href={`#${i.title}`} key={k}>
						{i.columns.map((a, b) => (
							<Index item={a} key={b}></Index>
						))}
					</Link>
				))}
			</Fragment>
		)
	} else {
		return <Link title={item.name} href={`#${item.name}`}></Link>
	}
}

export default window.$app.memo(Index)
