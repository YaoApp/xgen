export default () => {
	return (target: unknown, key: string, descriptor: PropertyDescriptor) => {
		const fn = descriptor.value

		descriptor.value = async (...args: any) => {
			let res, err

			try {
				res = await fn.apply(this, args)
			} catch (error: any) {
				err = error.response || error
			}

			return { res, err }
		}

		return descriptor
	}
}
