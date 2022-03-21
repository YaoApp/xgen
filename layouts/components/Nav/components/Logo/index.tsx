import logo_svg from '@/assets/images/logo.svg'

import styles from './index.less'

import type { IPropsLogo } from '@/layouts/types'

const Index = ({ logo }: IPropsLogo) => {
	return (
		<div className={styles._local}>
			{logo?.png ? (
				<span
					className='logo'
					style={{
						backgroundImage: `url(data:image/png;base64,${logo.png})`
					}}
				/>
			) : (
				<img className='logo img' src={logo_svg} alt='logo' />
			)}
		</div>
	)
}

export default window.$app.memo(Index)
