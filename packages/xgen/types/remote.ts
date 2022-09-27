import type { Component } from '@/types'

export declare namespace Remote {
	interface IProps extends Component.PropsEditComponent {
		xProps: {
			remote?: Component.Request
			search?: Component.Request & { key: string }
		}
	}
}
