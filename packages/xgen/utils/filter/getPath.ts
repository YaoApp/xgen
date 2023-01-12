export default (pathname: string) => {
	console.log('pathname: ', pathname)
      console.log('__BASE__: ', __BASE__)
      console.log('/__BASE__: ', `/${__BASE__}`)

	console.log('res: ', pathname.replace(`/${__BASE__}`, ''))

	return pathname.replace(`/${__BASE__}`, '')
}
