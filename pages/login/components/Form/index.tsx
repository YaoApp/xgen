import { observer } from 'mobx-react-lite'

import styles from './index.less'

const Index = () => {
	return <div className={styles._local}></div>
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
