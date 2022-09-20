import type { Admin } from './admin'
import type { User } from './user'

export interface Login {
	admin: Admin
	user: User
}
