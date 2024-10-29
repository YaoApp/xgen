import clsx from 'clsx'
import type { IPropsLoader } from '../types'
import styles from './Loader.less'

const Index = (props: IPropsLoader) => {
	const { size, events, remove } = props
	const ProgressBar = () => {
		const percent = events?.progress?.total
			? Math.floor(((events?.progress?.loaded || 0) / events?.progress?.total) * 100)
			: 0

		const totalMB = ((events?.progress?.total || 0) / 1024 / 1024).toFixed(2)
		const loadedMB = ((events?.progress?.loaded || 0) / 1024 / 1024).toFixed(2)
		const humanReadable = `${percent}%`

		return (
			<div className={clsx([styles.progress_wrap, events?.error && styles.has_error])}>
				<div className={styles.progress}>
					<div className={styles.bar} style={{ width: humanReadable }}></div>
				</div>
				<div className={styles.text}>
					<span className={styles.percent}>
						{events?.error ? events?.error.message : humanReadable}
					</span>
					{(events?.progress?.total || 0) > 0 && !events?.error && (
						<span>
							{loadedMB}MB / {totalMB}MB
						</span>
					)}
				</div>
			</div>
		)
	}

	const Loading = (
		<div
			className={clsx([
				styles._local,
				events?.error && styles.has_error,
				'xgen-upload xgen-upload-select xgen-upload-select-picture-card'
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
