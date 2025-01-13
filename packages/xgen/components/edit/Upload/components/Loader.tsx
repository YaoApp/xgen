import clsx from 'clsx'
import type { IPropsLoader } from '../types'

const Index = (props: IPropsLoader) => {
	const { size, events } = props
	const ProgressBar = () => {
		const percent = events?.progress?.total
			? Math.floor(((events?.progress?.loaded || 0) / events?.progress?.total) * 100)
			: 0

		const totalMB = ((events?.progress?.total || 0) / 1024 / 1024).toFixed(2)
		const loadedMB = ((events?.progress?.loaded || 0) / 1024 / 1024).toFixed(2)
		const humanReadable = `${percent}%`

		return (
			<div className={clsx(['progress_wrap', events?.error && 'has_error'])}>
				<div className={'progress'}>
					<div className={'bar'} style={{ width: humanReadable }}></div>
				</div>
				<div className={'text'}>
					<span className={clsx(['percent'])}>{events?.error ? '' : humanReadable}</span>
					{((events?.progress?.total || 0) > 0 || events?.error) && (
						<span>
							{events?.error ? events?.error.message : `${loadedMB}MB / ${totalMB}MB`}
						</span>
					)}
				</div>
			</div>
		)
	}

	const Loading = (
		<div
			className={clsx([
				'xgen-edit-upload-preview-loader',
				'xgen-upload xgen-upload-select xgen-upload-select-picture-card',
				events?.error && 'has_error'
			])}
			style={{
				width: size?.width || '90px',
				height: size?.height || '90px'
			}}
		>
			{ProgressBar()}
		</div>
	)

	return (
		<div>
			{props.loading && Loading}
			{!props.loading && props.children}
		</div>
	)
}

export default window.$app.memo(Index)
