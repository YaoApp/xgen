import apis from './apis'
import getToken from './getToken'

const Index = (name: string) => {
	return `${apis.getStorage}?name=${name}&token=${getToken()}`
}

export default Index
