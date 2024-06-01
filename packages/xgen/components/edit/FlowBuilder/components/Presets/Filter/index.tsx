import { Icon } from '@/widgets'
import { IconName, IconSize } from '../../../utils'
import { useBuilderContext } from '../../Builder/Provider'
import { Input } from 'antd'
import styles from './index.less'
import clsx from 'clsx'

interface IProps {
	onChange: (value: string) => void
}

const { Search } = Input

const Index = (props: IProps) => {
	const { is_cn, setting } = useBuilderContext()
	const placeholder = is_cn ? '搜索' : 'Search'
	return (
		<div className={clsx([styles._local])}>
			<Search
				placeholder={placeholder}
				enterButton={<Icon name='icon-search' size={14} />}
				onSearch={props.onChange}
				style={{ width: 160 }}
			/>
		</div>
	)
}

export default window.$app.memo(Index)
