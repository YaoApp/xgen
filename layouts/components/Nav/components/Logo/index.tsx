import logo from '@/assets/images/logo.svg'
import { useGlobal } from '@/context/app'

import styles from './index.less'

const Index = () => {
	const global = useGlobal()

	return (
		<div className={styles._local}>
			{global.app_info.icons?.png ? (
				<span
					className='logo'
					style={{
						backgroundImage: `url(data:image/png;base64,${global.app_info.icons?.png})`
					}}
				/>
			) : (
				<img className='logo img' src={logo} alt='logo' />
			)}
		</div>
	)
}

export default window.$app.memo(Index)
