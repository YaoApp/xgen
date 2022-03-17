import store from 'store2'

import { useGlobal } from '@/context/app'

import styles from './index.less'

const Index = () => {
	const global = useGlobal()

	return (
		<div className={styles._local}>
			<span
				className='logo'
				style={{
					backgroundImage: `url(data:image/png;base64,${global.app_info.icons?.png})`
				}}
			/>
		</div>
	)
}

export default window.$app.memo(Index)
