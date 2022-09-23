import type { Mongo } from './mongo'
import type { Mysql } from './mysql'
import type { Redis } from './redis'
import type { Sqlite3 } from './sqlite3'
import type { Pure } from '@/global'

export type Connectors = {
	mysql: Mysql
	redis: Redis
	mongo: Mongo
	sqlite3: Sqlite3
}

export type PureConnectors = Pure<Connectors>
