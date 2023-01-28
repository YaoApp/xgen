import { decode, local, session } from '../src/index'

describe('@yaoapp/storex', () => {
	it('Can local set, read and remove', () => {
		expect(local.test).toBe(undefined)

		local.test = 'Hello @yaoapp/storex'

		expect(local.test).toBe('Hello @yaoapp/storex')
		expect(local.test).toBe(decode(localStorage.getItem('test')))

		delete local.test

		expect(local.test).toBe(undefined)
	})

	it('Can session set, read and remove', () => {
		expect(session.test).toBe(undefined)

		session.test = 'Hello @yaoapp/storex'

		expect(session.test).toBe('Hello @yaoapp/storex')
		expect(session.test).toBe(decode(sessionStorage.getItem('test')))

		delete session.test

		expect(session.test).toBe(undefined)
	})

	it('Can session setItem', () => {
		expect(session.test).toBe(undefined)

		session.setItem('test', 'Hello @yaoapp/storex')

		console.log('?????????: ', local.test)

		// expect(session.test).toBe('Hello @yaoapp/storex')
		expect(session.test).toBe(decode(sessionStorage.getItem('test')))

		delete session.test

		expect(session.test).toBe(undefined)
	})

	it('Number', () => {
		local.test = 0
		expect(local.test).toBe(0)

		local.test = 1
		expect(local.test).toBe(1)

		local.test = -1
		expect(local.test).toBe(-1)

		local.test = 2.71
		expect(local.test).toBe(2.71)

		local.test = NaN
		expect(local.test).toBe(NaN)

		local.test = Infinity
		expect(local.test).toBe(Infinity)

		local.test = -Infinity
		expect(local.test).toBe(-Infinity)

		local.test = '0'
		expect(local.test).toBe('0')

		local.test = '1'
		expect(local.test).toBe('1')

		local.test = '-1'
		expect(local.test).toBe('-1')

		local.test = '2.71'
		expect(local.test).toBe('2.71')

		local.test = 'NaN'
		expect(local.test).toBe('NaN')

		local.test = 'Infinity'
		expect(local.test).toBe('Infinity')

		local.test = '-Infinity'
		expect(local.test).toBe('-Infinity')

		local.test = new Number(3.14)
		expect(local.test).toBe(3.14)
	})

	it('BigInt', () => {
		local.test = 1n
		expect(local.test).toBe(1n)

		local.test = '1n'
		expect(local.test).toBe('1n')
	})

	it('Boolean', () => {
		local.test = true
		expect(local.test).toBe(true)

		local.test = false
		expect(local.test).toBe(false)

		local.test = 'true'
		expect(local.test).toBe('true')

		local.test = 'false'
		expect(local.test).toBe('false')

		local.test = new Boolean(false)
		expect(local.test).toBe(false)
	})

	it('Null', () => {
		local.test = null
		expect(local.test).toBe(null)

		local.test = 'null'
		expect(local.test).toBe('null')
	})

	it('Undefined', () => {
		local.test = undefined
		expect(local.test).toBe(undefined)

		local.test = 'undefined'
		expect(local.test).toBe('undefined')
	})

	it('Object', () => {
		// JSON.stringify don't know how to serialize a BigInt
		local.test = {
			$string: 'Hello @yaoapp/storex',
			$number: 0,
			$boolean: true,
			$null: null,
			$undefined: undefined
		}
		expect(local.test).toEqual({
			$string: 'Hello @yaoapp/storex',
			$number: 0,
			$boolean: true,
			$null: null,
			$undefined: undefined
		})
	})

	it('Array', () => {
		local.test = []
		expect(local.test).toEqual([])

		local.test[0] = 'hello'
		expect(local.test).toEqual(['hello'])

		local.test.length = 0
		expect(local.test).toEqual([])

		local.test.push('hello', '@yaoapp/storex')
		expect(local.test).toEqual(['hello', '@yaoapp/storex'])

		expect(local.test.pop()).toBe('@yaoapp/storex')
	})

	it('Date', () => {
		local.test = new Date('2000-01-01T00:00:00.000Z')
		expect(local.test).toEqual(new Date('2000-01-01T00:00:00.000Z'))
	})

	it('RegExp', () => {
		local.test = new RegExp('ab+c')
		expect(local.test).toEqual(new RegExp('ab+c'))

		local.test = /ab+c/
		expect(local.test).toEqual(/ab+c/)
	})

	it('Function', () => {
		local.test = function () {
			return 'Hello @yaoapp/storex!'
		}
		expect(local.test()).toEqual('Hello @yaoapp/storex!')

		local.test = () => {
			return 'Hello @yaoapp/storex!'
		}
		expect(local.test()).toEqual('Hello @yaoapp/storex!')
	})

	it('Set', () => {
		local.test = new Set(['Hello @yaoapp/storex'])
		expect(local.test).toEqual(new Set(['Hello @yaoapp/storex']))
	})

	it('Map', () => {
		local.test = new Map([
			['hello', '@yaoapp/storex'],
			['foo', 'bar']
		])
		expect(local.test).toEqual(
			new Map([
				['hello', '@yaoapp/storex'],
				['foo', 'bar']
			])
		)
	})
})
