export default () => {
	return (target: unknown, key: string, descriptor: PropertyDescriptor) => {
            const fn = descriptor.value

		descriptor.value = async (...params) => {
			let res, err

			try {
				res = await fn(...params)
			} catch (error) {
				err = error.response
			}

			return { res, err }
		}
	}
}
