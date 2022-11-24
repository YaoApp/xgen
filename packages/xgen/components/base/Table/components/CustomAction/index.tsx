import { Fragment } from 'react'

import { X } from '@/components'

import type { IPropsCustomAction } from '../../types'

const Index = (props: IPropsCustomAction) => {
	const { setting, namespace, batch_columns, batch, search, setBatchActive } = props

	return (
		<Fragment>
			{setting.header.preset?.import && (
				<X
					type='optional'
					name='Table/Import'
					props={{
						...setting.header.preset.import,
						search
					}}
				></X>
			)}
			{setting.header.preset?.batch && (
				<X
					type='optional'
					name='Table/Batch'
					props={{
						namespace,
						columns: batch_columns,
						deletable: setting.header.preset?.batch.deletable,
						batch,
						setBatchActive
					}}
				></X>
			)}
		</Fragment>
	)
}

export default window.$app.memo(Index)
