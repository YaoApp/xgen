import { test } from '~/utils'

import * as styles from './index.module.less'

export interface IProps {}

const Index = (props: IProps) => {
	return (
		<div className={styles._local}>
			<div className='red'>1233</div>
		</div>
	)
}

export default Index
