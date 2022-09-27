import EventEmitter from 'eventemitter3'

import { Handle, memo, sleep } from '@/knife'

window.$app = {
	memo,
	sleep,
      Handle,
      Event:new EventEmitter()
}
