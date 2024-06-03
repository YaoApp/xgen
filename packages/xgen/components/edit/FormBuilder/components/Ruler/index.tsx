import clsx from 'clsx'
import styles from './index.less'

interface IProps {
	height?: number
	contentHeight?: number
}

const Index = (props: IProps) => {
	return (
		<div
			className={clsx([styles._local])}
			style={{
				height: Math.max(props.height || 300, props.contentHeight || 300)
			}}
		></div>
	)
}

export default window.$app.memo(Index)
