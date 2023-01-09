import Button from 'editorjs-button'

import Checklist from '@editorjs/checklist'
import Code from '@editorjs/code'
import Delimiter from '@editorjs/delimiter'
import Header from '@editorjs/header'
import Image from '@editorjs/image'
import InlineCode from '@editorjs/inline-code'
import Marker from '@editorjs/marker'
import NestedList from '@editorjs/nested-list'
import Paragraph from '@editorjs/paragraph'
import Quote from '@editorjs/quote'
import Raw from '@editorjs/raw'
import Table from '@editorjs/table'
import Underline from '@editorjs/underline'
import Warning from '@editorjs/warning'
import Video from '@weekwood/editorjs-video'

import type { EditorConfig } from '@editorjs/editorjs'

import type { ICustom } from './index'

interface IPropsGetTools extends Pick<ICustom, 'UploadByFileApi' | 'UploadByUrlApi'> {}

export const getTools = ({ UploadByFileApi, UploadByUrlApi }: IPropsGetTools) => {
	return {
		marker: Marker,
		inlineCode: InlineCode,
		underline: Underline,
		paragraph: {
			class: Paragraph,
			inlineToolbar: true,
			toolbox: { title: '段落' }
		},
		header: {
			class: Header,
			inlineToolbar: true,
			toolbox: { title: '标题' }
		},
		list: {
			class: NestedList,
			inlineToolbar: true,
			toolbox: { title: '列表' }
		},
		table: {
			class: Table,
			inlineToolbar: true,
			toolbox: { title: '表格' }
		},
		checklist: {
			class: Checklist,
			inlineToolbar: true,
			toolbox: { title: '清单' }
		},
		image: {
			class: Image,
			config: {
				endpoints: {
					byFile: UploadByFileApi,
					byUrl: UploadByUrlApi
				}
			},
			toolbox: { title: '图片' }
		},
		video: {
			class: Video,
			config: {
				endpoints: {
					byFile: UploadByFileApi,
					byUrl: UploadByUrlApi
				},
				player: {
					controls: true,
					autoplay: false
				}
			},
			toolbox: { title: '视频' }
		},
		warning: {
			class: Warning,
			toolbox: { title: '警告' }
		},
		quote: {
			class: Quote,
			toolbox: { title: '引用' }
		},
		delimiter: {
			class: Delimiter,
			toolbox: { title: '分割符' }
		},
		code: {
			class: Code,
			toolbox: { title: '代码' }
		},
		raw: {
			class: Raw,
			toolbox: { title: 'HTML' }
		},
		button: {
			class: Button,
			toolbox: { title: '按钮' }
		}
	} as EditorConfig['tools']
}

export const getI18N = () => {
	return {
		messages: {
			toolNames: {
				button: '按钮'
			},
			tools: {
				button: {
					'Button Text': '按钮文字',
					'Link Url': '跳转链接',
					Set: '确认',
					'Default Button': '默认'
				}
			}
		}
	} as EditorConfig['i18n']
}
