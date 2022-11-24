import { deepEqual, getDeepValue } from '@/knife'

export default (new_val: any, old_val: any, bind: string) => {
	let update = false

	const _new = getDeepValue(bind, new_val)
	const _old = getDeepValue(bind, old_val)

	if (!deepEqual(_new, _old)) update = true

	return update
}
