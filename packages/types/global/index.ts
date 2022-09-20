export type Path = string

export type Port = number

export type Host = string

export interface IComments {
	'zh-CN': string
	'en-US': string
}

export type Type<Value, Comments extends IComments, Default = null> = {
	value: Value
	comments: Comments
	default: Default
}
