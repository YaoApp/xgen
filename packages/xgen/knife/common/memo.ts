import { deepEqual } from 'fast-equals'
import { memo as react_memo } from 'react'

type Memo = <T>(el: (props: T) => JSX.Element | null) => React.MemoExoticComponent<(props: T) => JSX.Element | null>

const Index: Memo = (el) => {
	return react_memo(el, (prev, next) => deepEqual(prev, next))
}

export default Index
