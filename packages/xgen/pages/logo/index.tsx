import clsx from 'clsx'

import styles from './index.less'

const Index = () => {
	return (
		<div className={clsx([styles._local, 'w_100 h_100vh flex justify_center align_center'])}>
			<div className='xgen_logo_wrap flex justify_center align_center relative'>
				<div className='box_left box'></div>
				<div className='box_right box'></div>
				<div className='cross_line absolute'></div>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
