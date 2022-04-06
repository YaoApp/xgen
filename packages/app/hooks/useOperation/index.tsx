import ReactDom from 'react-dom'

import type { IPropsComponent, Action } from '@/types'

interface HandleOperation {
	namespace: IPropsComponent['__namespace']
	primary: IPropsComponent['__primary']
	it: Action
}

const handleOperation = ({ namespace, primary, it }: HandleOperation) => {
	console.log(namespace)

	ReactDom.render(<div>{namespace}</div>, document.getElementById('__modal_container'))
}

export default () => handleOperation
