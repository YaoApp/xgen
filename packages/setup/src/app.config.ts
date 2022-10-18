export const api = {
	check: '/api/__yao/app/check',
	setup: '/api/__yao/app/setup'
}

export const metadata_env = {
	YAO_LANG: {
		name: '语言',
		value: ['zh-CN', 'en-US']
	},
	YAO_ENV: {
		name: '启动模式',
		value: ['development', 'production']
	},
	YAO_PORT: {
		name: '服务端口号',
		value: 'number'
	}
}

export const metadata_connector = {
	type: {
		name: '数据库类型',
		value: ['mysql', 'sqlite3', 'mongo', 'redis']
	}
}

export const metadata_connector_options = {
	mysql: {
		db: {
			name: '数据库名称',
			value: 'string'
		},
		hosts: {
			name: 'Mysql服务设置',
			value: {
				host: {
					name: '服务域名',
					value: 'string'
				},
				port: {
					name: '服务端口',
					value: 'number'
				},
				user: {
					name: '用户名',
					value: 'string'
				},
				pass: {
					name: '密码',
					value: 'string'
				}
			}
		}
	},
	sqlite3: {
		file: {
			name: '数据库文件地址',
			value: 'string'
		}
	},
	mongo: {
		db: {
			name: '数据库名称',
			value: 'string'
		},
		hosts: {
			name: 'Mongo服务设置',
			value: {
				host: {
					name: '服务域名',
					value: 'string'
				},
				port: {
					name: '服务端口',
					value: 'number'
				},
				user: {
					name: '用户名',
					value: 'string'
				},
				pass: {
					name: '密码',
					value: 'string'
				}
			}
		}
	},
	redis: {
		db: {
			name: '数据库名称',
			value: 'string'
		},
		host: {
			name: '服务域名',
			value: 'string'
		},
		port: {
			name: '服务端口',
			value: 'number'
		},
		user: {
			name: '用户名',
			value: 'string'
		},
		pass: {
			name: '密码',
			value: 'string'
		}
	}
}
