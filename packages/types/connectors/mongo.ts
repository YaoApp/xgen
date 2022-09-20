import { Type } from '@/global'

import { Connector } from './common'

// https://www.mongodb.com/docs/drivers/go/current/fundamentals/connection/#connection-options
type ConnectionOptions = {
	connectTimeoutMS: Type<
		number,
		{
			'zh-CN': '连接超时时间'
			'en-US': 'Specifies the number of milliseconds to wait before timeout on a TCP connection'
		},
		30000
	>
	maxPoolSize: Type<
		number,
		{
			'zh-CN': '指定一个连接池在给定时间内可能拥有的最大连接数'
			'en-US': 'Specifies the maximum number of connections that a connection pool may have at a given time'
		},
		100
	>
	replicaSet: Type<
		string,
		{
			'zh-CN': '指定集群的副本集名称。复制集中的所有节点必须有相同的复制集名称，否则客户端将不把它们视为复制集的一部分'
			'en-US': 'Specifies the replica set name for the cluster. All nodes in the replica set must have the same replica set name, or the Client will not consider them as part of the set'
		}
	>
	maxIdleTimeMS: Type<
		number,
		{
			'zh-CN': '指定一个连接在被删除和关闭之前在连接池中保持闲置的最大时间。默认值是0，这意味着一个连接可以无限期地保持不使用'
			'en-US': 'Specifies the maximum amount of time a connection can remain idle in the connection pool before being removed and closed. The default is 0, meaning a connection can remain unused indefinitely'
		},
		0
	>
	minPoolSize: Type<
		number,
		{
			'zh-CN': '指定驱动程序在一个连接池中维护的最小连接数'
			'en-US': 'Specifies the minimum number of connections that the driver maintains in a single connection pool'
		},
		0
	>
	socketTimeoutMS: Type<
		number,
		{
			'zh-CN': '指定在返回网络错误之前，等待套接字读或写的毫秒数。默认值为0，表示没有超时'
			'en-US': 'Specifies the number of milliseconds to wait for a socket read or write to return before returning a network error. The 0 default value indicates that there is no timeout'
		},
		0
	>
	serverSelectionTimeoutMS: Type<
		number,
		{
			'zh-CN': '指定等待的毫秒数，以找到一个可用的、合适的服务器来执行一个操作'
			'en-US': 'Specifies the number of milliseconds to wait to find an available, suitable server to execute an operation'
		},
		30000
	>
	heartbeatFrequencyMS: Type<
		number,
		{
			'zh-CN': '指定定期背景服务器检查之间等待的毫秒数'
			'en-US': 'Specifies the number of milliseconds to wait between periodic background server checks'
		},
		10000
	>
	tls: Type<
		boolean,
		{
			'zh-CN': '指定是否要与实例建立传输层安全（TLS）连接。当在连接字符串中使用DNS种子列表（SRV）时，这将自动设置为true。你可以通过设置该值为false来覆盖这一行为'
			'en-US': 'Specifies whether to establish a Transport Layer Security (TLS) connection with the instance. This is automatically set to true when using a DNS seedlist (SRV) in the connection string. You can override this behavior by setting the value to false'
		},
		false
	>
	w: Type<
		string | number,
		{
			'zh-CN': '指定写的关注点。要了解更多关于数值的信息，请参见服务器文档中的写入关注选项'
			'en-US': 'Specifies the write concern. To learn more about values, see the server documentation on Write Concern options'
		}
	>
	directConnection: Type<
		boolean,
		{
			'zh-CN': '指定是否将所有操作强制分派给连接URI中指定的主机'
			'en-US': 'Specifies whether to force dispatch all operations to the host specified in the connection URI'
		},
		false
	>
}

type Host = {
	host: Type<
		string,
		{
			'zh-CN': '服务域名'
			'en-US': 'Mongo service host'
		}
	>
	port: Type<
		string,
		{
			'zh-CN': '服务端口'
			'en-US': 'Mongo service port'
		}
	>
	user: Type<
		string,
		{
			'zh-CN': '用户名'
			'en-US': 'Mongo username'
		}
	>
	pass: Type<
		string,
		{
			'zh-CN': '密码'
			'en-US': 'Mongo password'
		}
	>
}

type Options = {
	db: Type<
		string,
		{
			'zh-CN': '数据库名称'
			'en-US': 'Database name'
		}
	>
	params: Type<
		ConnectionOptions,
		{
			'zh-CN': 'Mongo参数'
			'en-US': 'Mongo Connection Options'
		}
	>
	hosts: Array<Host>
}

export type Mongo = Connector<string, 'mongo', string, Options>
