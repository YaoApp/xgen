import type { Action } from '@/types'

export default () => {
	return () => window.$app.Event.emit(`app/getUserMenu`)
}
