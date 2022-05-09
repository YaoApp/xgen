import { useCallback, useLayoutEffect, useRef } from 'react'

export default <T extends Function>(fn: T): T => {
	const ref = useRef(fn)

	useLayoutEffect(() => {
		ref.current = fn
	})

	// @ts-ignore
	return useCallback((...args) => {
		return ref.current(...args)
	}, [])
}
