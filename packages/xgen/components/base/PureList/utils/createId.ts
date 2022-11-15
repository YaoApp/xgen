import { nanoid } from 'nanoid/non-secure'

export default () => '_' + nanoid() + new Date().valueOf()