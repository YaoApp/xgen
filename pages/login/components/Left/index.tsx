import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import image_login_left from '@/assets/images/image_login_left.svg'
import logo from '@/assets/images/logo.svg'

import styles from './index.less'

const Index = () => {
	return (
		<div
			className={clsx([
				styles._local,
				'h_100 border_box relative flex justify_center align_center overflow_hidden'
			])}
            >
			<div className='logo_wrap absolute flex justify_center align_center bg_white'>
				<img className='logo' src={logo} alt='logo' />
                  </div>
                  <div className="grid absolute">透明白色网格</div>
			<img className='image_login_left' src={image_login_left} alt='image_login_left' />
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
