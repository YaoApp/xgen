import { useCallback, useLayoutEffect, useRef } from 'react'

export default <T extends Function>(fn: T) => {
	const ref = useRef(fn)

	useLayoutEffect(() => {
		ref.current = fn
	})

	return useCallback((...args) => {
		return ref.current(...args)
	}, [])
}
