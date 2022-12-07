import clsx from 'clsx'

import RowItem from '../RowItem'
import styles from './index.less'

import type { IPropsSection, IPropsRowItem } from '../../types'

const Index = (props: IPropsSection) => {
	const { namespace, primary, type, item } = props

	const props_row_item: IPropsRowItem = {
		namespace,
		primary,
		type,
		columns: item.columns
	}

	return (
		<div className={clsx([styles._local, 'w_100 border_box flex flex_column'])}>
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
			<RowItem {...props_row_item}></RowItem>
		</div>
	)
}

export default window.$app.memo(Index)
