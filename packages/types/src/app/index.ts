import { AppJson, PureAppJson } from './app_json'
import { Connectors, PureConnectors } from './connectors'
import { Env, PureEnv } from './env'
import { Login, PureLogin } from './login'

export type App = {
	Env: Env
	PureEnv: PureEnv
	AppJson: AppJson
	PureAppJson: PureAppJson
	Connectors: Connectors
	PureConnectors: PureConnectors
	Login: Login
	PureLogin: PureLogin
}
