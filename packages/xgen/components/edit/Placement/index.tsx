interface IProps {
	[key: string]: any
}
const Index = (props: IProps) => {
	return <div {...props}></div>
}

export default window.$app.memo(Index)
