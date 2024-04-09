import clsx from 'clsx'
import { When } from 'react-if'

import RowItem from '../RowItem'
import styles from './index.less'

import type { IPropsSection, IPropsRowItem } from '../../types'
import Text from '../Text'

const Index = (props: IPropsSection) => {
	const { namespace, primary, type, item, showSectionDivideLine } = props

	const props_row_item: IPropsRowItem = {
		namespace,
		primary,
		type,
		columns: item.columns
	}

	return (
		<div className={clsx([styles._local, 'w_100 border_box flex flex_column'])}>
			<When condition={item.title}>
				<a
					id={item.title}
					className='section_title_wrap flex flex_column disabled'
					href={`#${item.title}`}
				>
					<div className='flex align_center'>
						<span className={clsx(['section_title', showSectionDivideLine && 'with_line'])}>
							<Text {...item} text={item.title || ''} />
						</span>
						<When condition={showSectionDivideLine}>
							<span className='divide_line'></span>
						</When>
					</div>
					{item.desc && <span className='desc'>{item.desc}</span>}
				</a>
			</When>
			<RowItem {...props_row_item}></RowItem>
		</div>
	)
}

export default window.$app.memo(Index)
