import getToken from './getToken'

const Index = (name: string, appRoot: boolean = false) => {
	if (typeof name === 'string' && name.startsWith('http')) return name
	const token = getToken()
	const c = typeof name == 'string' && (name.includes('?') ? '&' : '?')
	return appRoot ? `${name}${c}token=${token}&app=1` : `${name}${c}token=${token}`
}

export default Index
