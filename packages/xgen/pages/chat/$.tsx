import clsx from 'clsx'
import { observer } from 'mobx-react-lite'

import { useGlobal } from '@/context/app'

import styles from './index.less'
import { IPropsNeo } from '@/layouts/types'
import NeoPage from '@/neo/components/Page'

const Index = () => {
	const global = useGlobal()

	// Neo Settings
	const props_neo: IPropsNeo = {
		stack: global.stack.paths.join('/'),
		api: global.app_info.optional?.neo?.api!,
		studio: global.app_info.optional?.neo?.studio,
		dock: global.app_info.optional?.neo?.dock || 'right-bottom'
	}

	return (
		<div className={clsx([styles._local, 'w_100 border_box flex flex_column'])}>
			<NeoPage {...props_neo}></NeoPage>
		</div>
	)
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
