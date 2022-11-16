import getToken from './getToken'

const Index = (name: string) => {
	if (name.startsWith('http')) return name

	return `${name}&token=${getToken()}`
}

export default Index
