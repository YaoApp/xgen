import EventEmitter from 'eventemitter3'

import { Handle, memo, sleep } from '@yaoapp/utils'

window.$app = {
	memo,
	sleep,
      Handle,
      Event:new EventEmitter()
}
