import Video from './components/Video'

import type { FileType } from './types'

export default {
	image: {
		listType: 'picture-card',
		className: 'image',
		desc: {
			'zh-CN': '上传图片',
			'en-US': 'Upload Image'
		}
	},
	file: {
		listType: 'text',
		className: 'file',
		desc: {
			'zh-CN': '上传文件',
			'en-US': 'Upload File'
		}
	},
	video: {
		listType: 'picture-card',
		className: 'video',
		desc: {
			'zh-CN': '上传视频',
			'en-US': 'Upload Video'
		},
		render: (_, file, fileList, { remove }) => <Video file={file} remove={remove}></Video>
	}
} as FileType
