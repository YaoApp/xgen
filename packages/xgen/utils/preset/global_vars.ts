import { Handle, memo, sleep } from '@/knife'
import EventEmitter from '@yaoapp/emittery'

window.$app = {
	api_prefix: '',
	memo,
	sleep,
	Handle,
	Event: new EventEmitter()
}
