import { makeAutoObservable } from 'mobx'

export default class Model {
      a = 1 
      
      constructor() {
            makeAutoObservable(this, {}, { autoBind: true })
	}
}
