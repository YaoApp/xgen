/**
 * The components for shadow dom and dynamic import
 */
export const ExportComponents: Record<string, ExportComponent> = {
	'edit/Upload': {
		styles: [
			'/components/edit/Upload/index.less',
			'/components/edit/Upload/components/Loader.less',
			'/components/edit/Upload/components/Audio.less',
			'/components/edit/Upload/components/Image.less',
			'/components/edit/Upload/components/Video.less',
			'@/assets/css/vidstack/theme.css',
			'@/assets/css/vidstack/layouts/audio.css',
			'@/assets/css/vidstack/layouts/video.css'
		]
	}
}

export interface ExportComponent {
	styles: string[]
}
