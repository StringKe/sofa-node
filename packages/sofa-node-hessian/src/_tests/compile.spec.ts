import * as assert from 'assert'

import { compile, encode } from '../index'

describe('compile.spec.ts', () => {
    it('should compile ok', () => {
        const fn = compile(
            {
                $class: 'java.lang.String',
                $: '123',
            },
            '2.0',
            {},
        )
        assert(typeof fn === 'function')
    })

    it('should compile setCache work', () => {
        const cacheObj = {
            get: () => {
                throw new Error('mock error')
            },
            set: () => {},
        }
        compile.setCache(cacheObj as never)

        try {
            encode(
                {
                    $class: 'java.util.Map',
                    $: { foo: 'bar' },
                    isMap: true,
                },
                '2.0',
                {},
                {},
                {},
            )
            assert(false, 'never here')
        } catch (err: any) {
            assert(err.message === 'mock error')
        }

        // recover
        compile.setCache(new Map())
    })

    it('should compile setCache WeakMap work', () => {
        const classMap = {}
        const cacheObj = {
            get: () => {
                throw new Error('mock error')
            },
            set: () => {},
        }
        const newMap = new Map<any, any>([
            [compile.classMapCacheOn, true],
            [classMap, cacheObj],
        ])
        compile.setCache(newMap)

        try {
            encode(
                {
                    $class: 'java.util.Map',
                    $: { foo: 'bar' },
                    isMap: true,
                },
                '2.0',
                classMap,
                {},
                {},
            )
            assert(false, 'never here')
        } catch (err: any) {
            assert(err?.message === 'mock error')
        }
        // recover
        compile.setCache(new Map())
    })
})
