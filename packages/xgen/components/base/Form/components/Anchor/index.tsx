import { Anchor } from 'antd'
import clsx from 'clsx'

import AnchorItem from '../AnchorItem'
import styles from './index.less'

import type { IPropsAnchor } from '../../types'

const { Link } = Anchor

const Index = (props: IPropsAnchor) => {
	const { sections } = props

	return (
		<div className={clsx([styles._local])}>
			<Anchor offsetTop={60} onClick={(e) => e.preventDefault()}>
				{sections.map((item, index: number) => (
					<Link className='section_title' title={item.title} href={`#${item.title}`} key={index}>
						{item.columns.map((it, idx: number) => (
							<AnchorItem item={it} key={idx}></AnchorItem>
						))}
					</Link>
				))}
			</Anchor>
		</div>
	)
}

export default window.$app.memo(Index)
