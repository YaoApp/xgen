import type { IsOptional } from './IsOptional'

export type DeepRequired<Obj> = {
	[Key in keyof Obj]-?: IsOptional<Key, Obj> extends never ? Obj[Key] : DeepRequired<Obj[Key]>
}
