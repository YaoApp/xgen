import getToken from './getToken'

const Index = (name: string) => {
	return `/api/${window.$app.api_prefix}/storage/url?name=${name}&token=${getToken()}`
}

export default Index
