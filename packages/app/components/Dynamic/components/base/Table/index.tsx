import { memo } from '@yaoapp/utils'

import Page from '../Page'
import styles from './index.less'

export interface IPropsTable {
	parent: 'Page' | 'Modal'
	model: string
}

const Index = (props: IPropsTable) => {
	const { parent, model } = props

	if (parent === 'Page') {
		return (
			<Page>
				<div className={styles._local}>
					<div className='red'>8666</div>
				</div>
			</Page>
		)
	}

	return (
		<div className={styles._local}>
			<div className='red'>8666</div>
		</div>
	)
}

export default memo(Index)
