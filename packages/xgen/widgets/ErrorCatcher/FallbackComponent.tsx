import type { FallbackProps } from 'react-error-boundary'
import clsx from 'clsx'

import { Icon } from '@/widgets'

import styles from './index.less'

const Index = (props: FallbackProps) => {
	const { error, resetErrorBoundary } = props
	const { name, message, stack } = error

	return (
		<div className={clsx([styles._local, 'w_100 border_box flex flex_column'])} role='alert'>
			<div className='error_header w_100 flex justify_between align_center'>
				<span className='error_name'>Error name: {name}</span>
				<button
					className='btn_retry clickable flex justify_center align_center'
					onClick={resetErrorBoundary}
				>
					<Icon name='restart_alt-outline'></Icon>
				</button>
			</div>
			<span className='error_message w_100 border_box'>{message}</span>
		</div>
	)
}

export default window.$app.memo(Index)
