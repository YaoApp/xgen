import EventEmitter from 'eventemitter3'

import { Handle, memo, sleep } from '@/knife'

window.$app = {
	api_prefix: '',
	memo,
	sleep,
	Handle,
	Event: new EventEmitter()
}
