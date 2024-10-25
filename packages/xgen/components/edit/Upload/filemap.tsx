import File from './components/File'
import Video from './components/Video'
import Audio from './components/Audio'
import Image from './components/Image'

import type { FileType, PreviewProps } from './types'
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
		preview: (props: PreviewProps, file: UploadFile<string>, remove: () => void) => {
			return <Image file={file} preivewSize={props.size} remove={remove} />
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
		preview: (props: PreviewProps, file: UploadFile<string>, remove: () => void) => {
			return <Audio file={file} preivewSize={props.size} remove={remove} />
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
		preview: (props: PreviewProps, file: UploadFile<string>, remove: () => void) => {
			return <File file={file} preivewSize={props.size} remove={remove} />
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
		preview: (props: PreviewProps, file: UploadFile<string>, remove: () => void) => {
			return <Video file={file} preivewSize={props.size} remove={remove} />
		}
	}
} as FileType
