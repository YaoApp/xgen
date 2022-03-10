import { observer } from 'mobx-react-lite'

const Index = () => {
	return <div>123</div>
}

export default new window.$app.Handle(Index).by(observer).by(window.$app.memo).get()
