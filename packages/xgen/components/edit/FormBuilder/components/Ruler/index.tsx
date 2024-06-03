import clsx from 'clsx'
import styles from './index.less'

interface IProps {
	width?: number
}

const Index = (props: IProps) => {
	return <div className={clsx([styles._local])}></div>
}

export default window.$app.memo(Index)
