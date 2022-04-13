import { Col, Row, Tabs } from 'antd'

import styles from './index.less'

import type { IPropsSection } from '../../types'

const Index = (props: IPropsSection) => {
	const { item } = props

	return (
		<div className='section w_100 border_box flex flex_column'>
			{item.title && (
				<a
					id={item.title}
					className='section_title_wrap flex flex_column disabled'
					href={`#${item.title}`}
				>
					<span className='section_title'>{item.title}</span>
					{item.desc && <span className='desc'>{item.desc}</span>}
				</a>
			)}
			<Row gutter={24} wrap={true}>
				{item.columns.map((it, idx) => {
					if ('tabs' in it) {
						return null
					} else {
					}
				})}
			</Row>
		</div>
	)
}

export default window.$app.memo(Index)
