import Table from '@/components/base/Table'

import type { IProps as IPropsTable } from '@/components/base/Table'

interface IProps {
	model: IPropsTable['model']
	query: IPropsTable['query']
}

const Index = (props: IProps) => {
	const { model, query } = props

	const props_table: IPropsTable = {
		parent: 'Form',
		model,
		query
	}

	// return <Table {...props_table}></Table>
	return <div>123</div>
}

export default window.$app.memo(Index)
