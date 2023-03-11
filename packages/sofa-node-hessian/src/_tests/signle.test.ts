import * as hessian from 'hessian.js'

import { V4 } from '..'
import { default as classMap } from './fixtures/class_map'

const version = '2.0'

const { encode, decode } = V4

const options = {
    debug: false,
}

it('should encode class that isMap = true', () => {
    const obj = {
        $class: 'com.test.service.ctx.UniformContextHeaders',
        $: {
            serviceProperies: { foo: 'bar' },
        },
    }

    const buf2 = encode(obj, version, classMap, {}, options)

    console.log(hessian)

    console.log('BUF2.1', hessian.decode(buf2, version, options))
})
