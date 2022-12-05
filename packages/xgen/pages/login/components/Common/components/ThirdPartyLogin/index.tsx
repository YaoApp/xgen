import { Button } from 'antd'
import clsx from 'clsx'

import styles from './index.less'

import type { IPropsThirdPartyLogin } from '../../../../types'

const Index = (props: IPropsThirdPartyLogin) => {
	const { items } = props

	return (
		<div className={clsx([styles._local, 'flex flex_column'])}>
			<div className='or_wrap flex justify_between align_center'>
				<span className='line'></span>
				<span className='text'>or</span>
				<span className='line'></span>
			</div>
			<div className='third_btn_wrap w_100 flex flex_column'>
				{items?.map((item) => (
					<a
						className='btn_third_wrap w_100'
						href={item.href}
						target={item.blank ? '_blank' : '_self'}
						key={item.title}
					>
						<Button
							className='w_100 btn_third flex justify_center align_center'
							shape='round'
							icon={item.icon && <img className='logo_third' src={item.icon} alt='logo' />}
						>
							{item.title}
						</Button>
					</a>
				))}
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
