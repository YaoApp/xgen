import axios from 'axios'

axios.interceptors.request.use(
	(config) => {
		return config
	},
      (error) => {
            console.log(123);
            
		return Promise.reject(error)
	}
)

axios.interceptors.response.use(
	(response) => {
		return response
	},
      (error) => {
            console.log(666);
            
		return Promise.reject(error)
	}
)