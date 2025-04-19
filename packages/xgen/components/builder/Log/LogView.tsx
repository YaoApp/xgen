import { LogItem } from './types'

interface IProps extends LogItem {
	className?: string
}

const Index = (props: IProps) => {
	const { message, level, type, hideDateTime, className } = props
	return <div className={className}>{message}</div>
}

export default window.$app.memo(Index)
