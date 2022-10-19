export type IsOptional<Key extends keyof Obj, Obj> = {} extends Pick<Obj, Key> ? Key : never
