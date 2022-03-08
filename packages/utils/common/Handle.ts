export default class Index<T> {
	private el: (props: T) => JSX.Element | null

	constructor(el: (props: T) => JSX.Element | null) {
		this.el = el
	}

	public by(fn: Function) {
		this.el = fn.call(this, this.el)

		return this
	}

	get() {
		return this.el
	}
}
