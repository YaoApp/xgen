export default () => {
	return (target: unknown, key: string, descriptor: PropertyDescriptor) => {
		const fn = descriptor.value

		descriptor.value = async () => {
			let res, err

			try {
				res = await fn()
			} catch (err) {
				err = err
			}

			return { res, err }
		}
	}
}
