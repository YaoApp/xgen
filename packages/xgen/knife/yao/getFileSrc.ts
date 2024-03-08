import getToken from './getToken'

const Index = (name: string) => {
	if (name && name.startsWith('http')) return name
	return `${name}&token=${getToken()}`
}

export default Index
