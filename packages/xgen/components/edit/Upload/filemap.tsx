import File from './components/File'
import Video from './components/Video'
import Audio from './components/Audio'
import Image from './components/Image'

import type { FileType, FileTypeEvents, PreviewProps, ValueType } from './types'
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
		preview: (
			props: PreviewProps,
			file: UploadFile<ValueType>,
			remove: () => void,
			abort: () => void,
			events: FileTypeEvents
		) => {
			return <Image file={file} abort={abort} remove={remove} events={events} {...props} />
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
		preview: (
			props: PreviewProps,
			file: UploadFile<ValueType>,
			remove: () => void,
			abort: () => void,
			events: FileTypeEvents
		) => {
			return <Audio file={file} remove={remove} abort={abort} events={events} {...props} />
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
		preview: (
			props: PreviewProps,
			file: UploadFile<ValueType>,
			remove: () => void,
			abort: () => void,
			events: FileTypeEvents
		) => {
			return <File file={file} remove={remove} abort={abort} events={events} {...props} />
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
		preview: (
			props: PreviewProps,
			file: UploadFile<ValueType>,
			remove: () => void,
			abort: () => void,
			events: FileTypeEvents
		) => {
			return <Video file={file} remove={remove} abort={abort} events={events} {...props} />
		}
	}
} as FileType
