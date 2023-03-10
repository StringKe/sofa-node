/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as assert from 'assert'

import utils from '../utils'

describe('util.test.ts', () => {
    it('should handle generic', () => {
        const info = {
            $class: 'java.util.List',
            $: [],
            generic: [
                {
                    type: 'java.util.List',
                    generic: [{ type: 'com.sofa.testObject' }],
                },
            ],
        }
        let id = utils.normalizeUniqId(info, '2.0')
        assert(id === 'java.util.List#java.util.List#com.sofa.testObject#2.0')
        id = utils.normalizeUniqId(info, '1.0')
        assert(id === 'java.util.List#java.util.List#com.sofa.testObject#1.0')
    })
})
