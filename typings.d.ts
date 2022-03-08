declare module '*.less'
declare module '*.css'
declare module '*.png'
declare module '*.svg'
declare module 'less-vars-to-js'

declare class Handle<T> {
	constructor(el: (props: T) => JSX.Element | null)
	by(fn: Function): this
	get(): (props: T) => JSX.Element
}

interface Window {
	$app: {
		memo: <T>(
			el: (props: T) => JSX.Element | null
		) => React.MemoExoticComponent<(props: T) => JSX.Element | null>
		sleep: (time: number) => Promise<unknown>
		Handle: typeof Handle
	}
}
