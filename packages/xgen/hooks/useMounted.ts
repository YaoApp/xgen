import { useMount } from 'ahooks'
import { useState } from 'react'

export default () => {
	const [mounted, setMounted] = useState(false)

	useMount(() => setMounted(true))

	return mounted
}
