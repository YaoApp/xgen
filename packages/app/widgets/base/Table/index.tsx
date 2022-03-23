import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import Page from '../Page'
import Table from './components/Table'
import styles from './index.less'

export interface IPropsTable {
	parent: 'Page' | 'Modal'
	model: string
}

const Index = (props: IPropsTable) => {
	const { parent, model } = props

	if (parent === 'Page') {
		return (
			<Page className={clsx([styles._local, 'w_100'])}>
				<Table></Table>
			</Page>
		)
	}

	return (
		<div className={clsx([styles._local, 'w_100'])}>
			<Table></Table>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
