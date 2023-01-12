export default (pathname: string) => {
	console.log('pathname: ', pathname)
      console.log('$runtime.BASE: ', $runtime.BASE)
      console.log('/$runtime.BASE: ', `/${$runtime.BASE}`)

      const base = $runtime.BASE
      
      console.log('/$runtime.BASE: ', `/${base}`)

	console.log('res: ', pathname.replace(`/${$runtime.BASE}`, ''))

	return pathname.replace(`/${$runtime.BASE}`, '')
}
