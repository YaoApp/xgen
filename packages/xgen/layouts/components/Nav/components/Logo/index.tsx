import logo_svg from '@/assets/images/logo.svg'

import styles from './index.less'

import type { IPropsLogo } from '@/layouts/types'

const Index = ({ logo }: IPropsLogo) => {
	return (
		<div className={styles._local}>
			<img className='logo img' src={logo ?? logo_svg} alt='logo' />
		</div>
	)
}

export default window.$app.memo(Index)
