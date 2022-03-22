import { memo } from '@yaoapp/utils'

import styles from './index.module.less'

export interface IPropsTable {
	parent: 'Page' | 'Modal'
	model: string
}

const Index = (props: IPropsTable) => {
	console.log(props)

	return (
		<div className={styles._local}>
			<div className='red'>666</div>
		</div>
	)
}

export default memo(Index)
