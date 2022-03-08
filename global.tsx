import { configure } from 'mobx'

import { Handle, memo, sleep } from '@yaoapp/utils'

configure({ enforceActions: 'never' })

window.$app = {
	memo,
	sleep,
	Handle
}

export {}
