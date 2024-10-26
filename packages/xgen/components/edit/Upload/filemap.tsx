import File from './components/File'
import Video from './components/Video'
import Audio from './components/Audio'
import Image from './components/Image'

import type { FileType, PreviewProps, ValueType } from './types'
import { UploadFile } from 'antd'

export default {
	image: {
		listType: 'picture-card',
		className: 'image',
		placeholder: {
			'zh-CN': '上传图片',
			'en-US': 'Upload Image'
		},
		placeholderIcon: 'icon-upload',
		preview: (props: PreviewProps, file: UploadFile<ValueType>, remove: () => void) => {
			return <Image file={file} remove={remove} {...props} />
		}
	},

	audio: {
		listType: 'picture-card',
		className: 'image',
		placeholder: {
			'zh-CN': '上传音频',
			'en-US': 'Upload Audio'
		},
		placeholderIcon: 'icon-upload',
		preview: (props: PreviewProps, file: UploadFile<ValueType>, remove: () => void) => {
			return <Audio file={file} remove={remove} {...props} />
		}
	},

	file: {
		listType: 'picture-card',
		className: 'image',
		placeholder: {
			'zh-CN': '上传文件',
			'en-US': 'Upload File'
		},
		placeholderIcon: 'icon-upload',
		preview: (props: PreviewProps, file: UploadFile<ValueType>, remove: () => void) => {
			return <File file={file} remove={remove} {...props} />
		}
	},

	video: {
		listType: 'picture-card',
		className: 'image',
		placeholder: {
			'zh-CN': '上传视频',
			'en-US': 'Upload Video'
		},
		placeholderIcon: 'icon-upload',
		preview: (props: PreviewProps, file: UploadFile<ValueType>, remove: () => void) => {
			return <Video file={file} remove={remove} {...props} />
		}
	}
} as FileType
