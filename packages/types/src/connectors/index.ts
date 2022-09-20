import type { Mongo } from './mongo'
import type { Mysql } from './mysql'
import type { Redis } from './redis'
import type { Sqlite3 } from './sqlite3'

export type Connectors = {
	mysql: Mysql
	redis: Redis
	mongo: Mongo
	sqlite3: Sqlite3
}
