declare class Handle<T> {
	constructor(el: (props: T) => JSX.Element | null)
	by(fn: Function): this
	get(): (props: T) => JSX.Element | null
}
