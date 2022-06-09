export default (pathname: string) => {
	return pathname.replace(`/${$runtime.BASE}`, '')
}
