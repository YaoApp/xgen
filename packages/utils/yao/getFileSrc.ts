import apis from './apis'

const Index = (name: string) => {
	return `${apis.getStorage}?name=${name}&token=${sessionStorage.getItem('token') || ''}`
}

export default Index
