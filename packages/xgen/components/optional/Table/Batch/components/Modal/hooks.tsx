import { useEffect, useState } from 'react'

import type { Common } from '@/types'

export const useOptions = (columns: Array<Common.Column>) => {
	const [options, setOptions] = useState<Array<any>>([])

	useEffect(() => {
		const _options = columns.reduce((total: Array<Common.Column & { checked: boolean }>, item) => {
			if (item.edit?.type) {
				total.push({
					...item,
					checked: false
				})
			}

			return total
		}, [])

		setOptions(_options)
	}, [columns])

	return { options, setOptions }
}
