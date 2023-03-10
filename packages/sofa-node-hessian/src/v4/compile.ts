import * as assert from 'assert'
import * as fs from 'fs'
import * as path from 'path'

import * as codegen from '@protobufjs/codegen'

import { combineCompile, compileProp } from '../base'
import TypeMap from '../PrimitiveType'
import { TypeGenFn } from '../types'
import utils from '../utils'
import { default as JavaUtilMap } from './types/java.util.map'

const typeMap: Record<string, TypeGenFn> = Object.assign({}, TypeMap, {
    'java.util.Map': JavaUtilMap,
    'java.util.HashMap': JavaUtilMap,
    customMap: JavaUtilMap,
})

const arrayTypeMap: Record<string, string> = {
    'java.util.Locale': 'com.caucho.hessian.io.LocaleHandle',
}
const bufferType: Record<string, boolean> = {
    byte: true,
    'java.lang.Byte': true,
}
export const classMapCacheOn = Symbol('classMapCacheOn')

let getCompileCache: (classMap?: Record<string, any> | null) => Map<any, any>
export default (() => {
    const fn = combineCompile('v4', compile, classMapCacheOn)
    getCompileCache = fn.getCompileCache
    return fn
})()

function compile(
    uniqueId: string,
    info: any,
    classMap?: Record<string, any> | null,
    version?: string,
    options?: any,
) {
    const compileCache = getCompileCache(classMap)
    let encodeFn = compileCache.get(uniqueId)
    if (encodeFn) return encodeFn

    const type = info.type || info.$class
    // 先获取 classInfo，因为 type 后面会变
    const classInfo = classMap && classMap[type]

    const gen = codegen(['obj', 'encoder', 'appClassMap'], 'encode')
    // 默认值
    if (info.defaultValue) {
        gen('if (obj == null) { obj = %j; }', info.defaultValue)
    }
    if (info.isArray) {
        gen('if (obj == null) { return encoder.writeNull(); }')
        const arrayDepth = info.arrayDepth || 1
        if (bufferType[type] && arrayDepth === 1) {
            gen('encoder.writeBytes(obj);')
        } else {
            let arrayType = arrayTypeMap[type] || type
            for (let i = 0; i < arrayDepth; i++) arrayType = '[' + arrayType

            gen('if (encoder._checkRef(obj)) { return; }')
            gen(
                "const hasEnd = encoder._writeListBegin(obj.length, '%s');",
                arrayType,
            )

            const item =
                arrayDepth > 1
                    ? {
                          type,
                          arrayDepth: arrayDepth - 1,
                          isMap: info.isMap,
                          isEnum: info.isEnum,
                          isArray: info.isArray,
                          generic: info.generic,
                          abstractClass: info.abstractClass,
                      }
                    : {
                          type,
                          isMap: info.isMap,
                          isEnum: info.isEnum,
                          generic: info.generic,
                          abstractClass: info.abstractClass,
                      }
            const uniqueId = utils.normalizeUniqId(item, version)
            gen('for (const item of obj) {')
            gen(
                "  compile('%s', %j, classMap, version, %j)(item && item.$class ? item.$ : item, encoder, appClassMap);",
                uniqueId,
                item,
                options,
            )
            gen('}')
            gen("if (hasEnd) { encoder.byteBuffer.putChar('z'); }")
        }
    } else if (typeMap[type]) {
        typeMap[type](gen, info, version, options)
    } else if (info.isMap) {
        typeMap['customMap'](gen, info, version, options)
    } else if (classInfo && !info.abstractClass && !info.$abstractClass) {
        gen('if (obj == null) { return encoder.writeNull(); }')
        gen('if (obj && obj.$class) {')
        gen('  const fnKey = utils.normalizeUniqId(obj, version);')
        gen(
            '  compile(fnKey, obj, classMap, version, %j)(obj.$, encoder, appClassMap);',
            options,
        )
        gen('  return;')
        gen('}')
        gen('if (encoder._checkRef(obj)) { return; }')

        const keys = classInfo
            ? Object.keys(classInfo).filter((key) => {
                  const attr = classInfo[key]
                  return !attr.isStatic && !attr.isTransient
              })
            : []

        if (version === '1.0') {
            gen('encoder.byteBuffer.put(0x4d);')
            gen("encoder.writeType('%s');", type)
            for (const key of keys) {
                gen("encoder.writeString('%s');", key)
                compileProp(gen, info, key, classInfo, version, options)
            }
            gen('encoder.byteBuffer.put(0x7a);')
        } else {
            gen("const ref = encoder._writeObjectBegin('%s');", type)
            gen('if (ref === -1) {')
            gen('encoder.writeInt(%d);', keys.length)
            for (const key of keys) {
                gen("encoder.writeString('%s');", key)
            }
            gen("encoder._writeObjectBegin('%s'); }", type)

            for (const key of keys) {
                compileProp(gen, info, key, classInfo, version!, options)
            }
        }
    } else if (info.isEnum) {
        gen('if (obj == null) { return encoder.writeNull(); }')
        gen('const name = obj.$name || obj.name || obj;')
        gen('encoder.objects.push(obj);')

        if (version === '1.0') {
            gen('encoder.byteBuffer.put(0x4d);')
            gen("encoder.writeType('%s');", type)
            gen("encoder.writeString('name');")
            gen('encoder.writeString(name);')
            gen('encoder.byteBuffer.put(0x7a);')
        } else {
            gen("const ref = encoder._writeObjectBegin('%s');", type)
            gen('if (ref === -1) {')
            gen('encoder.writeInt(1);')
            gen("encoder.writeString('name');")
            gen("encoder._writeObjectBegin('%s'); }", type)
            gen('encoder.writeString(name);')
        }
    } else {
        gen('if (obj == null) { return encoder.writeNull(); }')
        gen('if (obj && obj.$class) {')
        gen('  const fnKey = utils.normalizeUniqId(obj, version);')
        gen(
            '  compile(fnKey, obj, classMap, version, %j)(obj.$, encoder, appClassMap);',
            options,
        )
        gen('}')
        gen("else { encoder.write({ $class: '%s', $: obj }); }", type)
    }
    if (!options.debug) {
        encodeFn = gen({ compile, classMap, version, utils })
    } else {
        assert(
            options.debugDir,
            'debugDir is empty, please set debugDir in options or HESSIAN_COMPILE_DEBUG_DIR',
        )
        const func = `
module.exports = function (compile, classMap, version, utils) {
  return ${gen.toString()};
};
`
        const jsFile = path.join(options.debugDir, `${uniqueId}.js`)
        fs.writeFileSync(jsFile, func)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        encodeFn = require(jsFile)(compile, classMap, version, utils)
    }
    compileCache.set(uniqueId, encodeFn)
    return encodeFn
}