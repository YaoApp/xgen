import { message } from 'antd'

export const install = async () => {
	const runtime = await import('@lcdp/offline-plugin/runtime')

	let closer_message_updating: any
	let closer_message_ready: any

	runtime.install({
		onUpdating: () => {
			closer_message_updating = message.loading('updating...')
		},
		onUpdateReady: () => {
			closer_message_updating()

			closer_message_ready = message.loading('installing')

			runtime.applyUpdate()
		},
		onUpdated: () => {
			closer_message_ready()

			window.location.reload()
		},
		onUpdateFailed: () => {
			message.error('update failed')
		}
	})
}
