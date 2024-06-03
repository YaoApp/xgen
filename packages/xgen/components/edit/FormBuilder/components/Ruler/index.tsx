import clsx from 'clsx'
import styles from './index.less'

interface IProps {
	fullscreen?: boolean
	height?: number
	contentHeight?: number
}

const Index = (props: IProps) => {
	return (
		<div
			className={clsx([styles._local])}
			style={{
				position: props.fullscreen ? 'fixed' : 'absolute',
				height: Math.max(props.height || 300, props.contentHeight || 300)
			}}
		></div>
	)
}

export default window.$app.memo(Index)
