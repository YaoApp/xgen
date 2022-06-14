import clsx from 'clsx'

import { CloudUploadOutlined } from '@ant-design/icons'
import { getLocale } from '@umijs/max'

import filemap from '../filemap'

import type { IPropsUploadBtn } from '../types'

const Index = (props: IPropsUploadBtn) => {
	const { length, filetype, maxCount, desc } = props
      const locale = getLocale()
      
	return (
		<div
			className={clsx([
				'btn_upload_wrap flex align_center cursor_point',
				filetype,
				length ? 'has_data' : '',
				filetype === 'file' && maxCount === 1 && 'one_file'
			])}
		>
			<CloudUploadOutlined style={{ fontSize: 24 }} />
			<span className='desc'>{desc ?? filemap[filetype].desc[locale]}</span>
		</div>
	)
}

export default window.$app.memo(Index)
