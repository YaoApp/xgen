import type { IPropsTooolbar } from '../types'
import { Icon } from '@/widgets'
const Index = (props: IPropsTooolbar) => {
	const { loading, events, remove, abort, preview, showOpration } = props
	return (
		<div className='toolbar' style={{ display: showOpration ? 'flex' : 'none' }}>
			<div className='toolbar-button' onClick={preview} style={{ display: loading ? 'none' : 'flex' }}>
				<Icon name='icon-download' size={16}></Icon>
			</div>
			<div className='toolbar-button' onClick={remove} style={{ display: !loading ? 'flex' : 'none' }}>
				<Icon name='icon-trash' size={16}></Icon>
			</div>

			<div
				className='toolbar-button'
				onClick={abort}
				style={{ display: !events?.error && loading ? 'flex' : 'none' }}
			>
				<Icon name='icon-x-circle' size={16}></Icon>
			</div>

			<div className='toolbar-button' onClick={remove} style={{ display: events?.error ? 'flex' : 'none' }}>
				<Icon name='icon-refresh-cw' size={16}></Icon>
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
