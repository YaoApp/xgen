import { useEffect, useState } from 'react'
import { Section } from '../types'
import Column from '../Column'

interface IProps {
	id?: string
	data?: Record<string, any>
	section: Section
	onChange?: (id: string, bind: string, value: any) => void
}

const Index = (props: IProps) => {
	const item = props.section
	const [data, setData] = useState(props.data)
	useEffect(() => setData(props.data), [props.data])

	const onChange = (id?: string, bind?: string, value?: any) => {
		if (bind) {
			setData((prev) => {
				const newData = { ...prev }
				newData[bind] = value
				return newData
			})

			if (id) {
				props.onChange && props.onChange(id, bind, value)
			}
		}
	}

	return (
		<div className='section'>
			{item.title && item.title != '' && <div className='section-title'>{item.title}</div>}
			<div className='section-fields'>
				{item.columns.map((column, index) => {
					const label = column.name
					const bind = column.component?.bind
					const value = data?.[bind || column.name]
					const columnProps = {
						...(column.component?.edit.props || {}),
						__name: label,
						__bind: bind,
						__namespace: `${props.id}.${index}.${bind}`,
						onChange: (value: any) => onChange(props.id, bind, value),
						value
					}

					return (
						<Column
							key={`${column.name}-${index}`}
							name={column.component?.edit.type || 'Input'}
							props={{ ...columnProps }}
						/>
					)
				})}
			</div>
		</div>
	)
}

export default window.$app.memo(Index)
