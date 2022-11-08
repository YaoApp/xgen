import UrlPattern from 'url-pattern'

import { useLocation } from '@umijs/max'

type Hook = <T>(pattern: RegExp, names?: string[]) => T

const hook: Hook = (pattern, names) => {
	const { pathname } = useLocation()

	return new UrlPattern(pattern, names).match(pathname)
}

export default hook
