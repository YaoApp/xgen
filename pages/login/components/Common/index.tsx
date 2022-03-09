import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import Form from '../Form'
import Left from '../Left'
import styles from './index.less'

const Index = () => {
	return (
		<div className={clsx([styles._local, 'w_100vw h_100vh flex'])}>
			<Left></Left>
			<div className='right_wrap h_100 border_box bg_white'>
				<Form></Form>
			</div>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
