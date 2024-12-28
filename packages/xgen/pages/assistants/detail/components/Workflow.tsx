import { Empty } from 'antd'
import styles from '../index.less'

const Workflow: React.FC = () => {
	return (
		<div className={styles.workflow}>
			<Empty description='Workflow editor coming soon' image={Empty.PRESENTED_IMAGE_SIMPLE} />
		</div>
	)
}

export default Workflow
