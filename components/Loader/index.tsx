import clsx from 'clsx'

import styles from './index.less'

interface IProps {
	loading: boolean
	fold_menu: boolean
}

const Index = (props: IProps) => {
	const { loading, fold_menu } = props

	return (
		<div
			className={clsx([
				styles._local,
				loading ? styles.show : '',
				fold_menu ? styles.fold : ''
			])}
		>
			<div className='wrap'>
				<div className='inner' />
				<div className='text'>loading</div>
			</div>
		</div>
	)
}

export default Index
