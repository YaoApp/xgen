import styles from './index.less'

const Index = () => {
	return <div className={styles._local}></div>
}

export default new window.$app.Handle(Index).by(window.$app.memo).get()
