import clsx from 'clsx'

import not_found from '@/assets/images/404.svg'
import { useGlobal } from '@/context/app'

import styles from './index.less'

const Index = () => {
	const global = useGlobal()

	return (
		<div className={clsx([styles._local, 'w_100 h_100vh flex flex_column justify_center align_center'])}>
			<img className='not_found' src={not_found} alt='404' />
			<span className='text mt_20'>{global.locale_messages?.layout?.not_found}</span>
		</div>
	)
}

export default window.$app.memo(Index)
