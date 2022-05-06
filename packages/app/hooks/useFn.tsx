import { useCallback, useLayoutEffect, useRef } from 'react'

function hook<T extends Function>(fn: T) {
	const ref = useRef(fn)

	useLayoutEffect(() => {
		ref.current = fn
	})

	return useCallback((...args) => {
		return ref.current(...args)
	}, [])
}

export default hook
