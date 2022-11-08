import clsx from 'clsx'

import dot from '@/assets/images/dot.svg'
import image_login_left from '@/assets/images/image_login_left.svg'
import logo_yao from '@/assets/images/logo.svg'

import styles from './index.less'

import type { IPropsLoginWrapperLeft } from '../../../../types'

const Index = (props: IPropsLoginWrapperLeft) => {
	const { logo, layout } = props

	return (
		<div
			className={clsx([
				styles._local,
				'h_100 border_box relative flex justify_center align_center overflow_hidden'
			])}
		>
			<div className='grid w_100 h_100 absolute' style={{ backgroundImage: `url(${dot})` }}></div>
			<div className='logo_wrap absolute flex justify_center align_center bg_white'>
				<img className='logo' src={logo ?? logo_yao} alt='logo' />
			</div>
			<div className='circle absolute'></div>
			<div className='content_wrap flex flex_column justify_center align_center relative'>
				<img
					className='image_login_left'
					src={layout?.cover ?? image_login_left}
					alt='image_login_left'
				/>
				<a
					className='words_wrap text_center'
					target='_blank'
					href={layout?.site ?? 'https://yaoapps.com'}
				>
					{layout?.slogan ?? 'Make Your Dream With Yao App Engine'}
				</a>
			</div>
			<a
				className='link_wrap w_100 text_center absolute'
				target='_blank'
				href={layout?.site ?? 'https://yaoapps.com'}
			>
				{layout?.site ?? 'more info visit yaoapps.com'}
			</a>
		</div>
	)
}

export default window.$app.memo(Index)
