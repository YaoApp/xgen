import styles from './index.less'

const Index = () => {
	return <div className={styles._local}>404</div>
}

export default window.$app.memo(Index)
