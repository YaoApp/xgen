declare module '*.less';
declare module '*.css';
declare module '*.png';
declare module '*.svg';
declare module 'less-vars-to-js'

interface Window {
	$app: {
		memo: <T>(
			el: (props: T) => JSX.Element | null
		) => React.MemoExoticComponent<(props: T) => JSX.Element | null>
		sleep: (time: number) => Promise<unknown>
	}
}
