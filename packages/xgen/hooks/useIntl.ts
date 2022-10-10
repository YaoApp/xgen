import { useIntl } from '@umijs/max'

import type { LocaleMessages } from '@/types'

export default () => {
	const intl = useIntl() as any

	return intl.messages as LocaleMessages
}
