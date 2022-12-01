import { find } from 'lodash-es'

const Index = (items: Array<any>, paths: Array<string | number>, key: string) => {
	return paths.reduce((total, v) => {
		const target = find(items, (item) => item[key] === v)

            if (target?.children?.length) {
                  paths.shift()
                  
			total = Index(target.children, paths, key)
		} else {
			total = target
            }

		return total
	}, {} as any)
}

export default Index
