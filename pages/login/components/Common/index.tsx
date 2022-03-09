import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import Form from '../Form'
import Left from '../Left'
import styles from './index.less'

const Index = () => {
	return (
		<div className={clsx([styles._local, 'w_100vw h_100vh flex '])}>
			<Left></Left>
			<div className='right_wrap h_100 border_box bg_white flex flex_column align_center justify_center relative'>
				<div className='title_wrap relative'>
					<span className='title'>登录</span>
					<span className='user_type absolute white'>Admin</span>
				</div>
				<Form></Form>
				<div className='copyright w_100 absolute flex justify_center'>
					<span>由</span>
					<a href='https://www.iqka.com/' target='_blank'>
						象传智慧
					</a>
					<span>提供技术支持</span>
				</div>
			</div>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
