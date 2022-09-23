import type { Admin } from './admin'
import type { User } from './user'
import type { Pure } from '@/global'

export interface Login {
	admin: Admin
	user: User
}

export type PureLogin = Pure<Login>