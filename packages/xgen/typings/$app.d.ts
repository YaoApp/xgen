interface $App {
	memo: <T>(
		el: (props: T) => JSX.Element | null
	) => React.MemoExoticComponent<(props: T) => JSX.Element | null>
	sleep: (time: number) => Promise<unknown>
	Handle: typeof Handle
	Event: EventEmitter<string | symbol, any>
}
