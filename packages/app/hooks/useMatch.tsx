import UrlPattern from 'url-pattern'

import { useLocation } from '@umijs/max'

type Hook = <T>(pattern: string) => T

const hook:Hook = (pattern) => {
	const { pathname } = useLocation()

	return new UrlPattern(pattern).match(pathname)
}

export default hook
