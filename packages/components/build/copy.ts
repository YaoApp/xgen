import fs from 'fs-extra'
import { resolve } from 'path'

fs.copySync(resolve('./assets'), resolve('./dist'))
