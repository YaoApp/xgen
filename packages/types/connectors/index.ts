import { Mongo } from './mongo'
import { Mysql } from './mysql'
import { Redis } from './redis'
import { Sqlite3 } from './sqlite3'

export type Connectors = {
	mysql: Mysql
	redis: Redis
	mongo: Mongo
	sqlite3: Sqlite3
}
