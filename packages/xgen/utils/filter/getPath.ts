export default (pathname: string) => {
	console.log('pathname: ', pathname)
      console.log('$runtime.BASE: ', $runtime.BASE)      

	return pathname.replace(`/${$runtime.BASE}`, '')
}
