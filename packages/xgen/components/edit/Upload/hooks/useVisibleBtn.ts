import { useMemo } from 'react'

export default (length: number, maxCount: number) => {
	return useMemo(() => {
		if (!maxCount) return true

		return length < maxCount
	}, [length, maxCount])
}
