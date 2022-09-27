import { Form } from 'antd'

import { X } from '@/components'

import type { IPropsStep1 } from '../types'

const Index = (props: IPropsStep1) => {
	const { file_name, setFileName, next } = props
	const value = file_name ? [file_name] : undefined

	return (
		<Form
			initialValues={{ sheet: value }}
			onValuesChange={(v) => {
				if (!v.sheet[0]) return

				setFileName(v.sheet[0])
				next()
			}}
		>
			<X
				type='edit'
				name='Upload'
				props={{
					__bind: 'sheet',
					filetype: 'file',
					multiple: false,
					maxCount: 1,
					desc: '拖入或点击上传 Excel、CSV 文件',
					one_file: true
				}}
			></X>
		</Form>
	)
}

export default window.$app.memo(Index)
