/* eslint-disable @typescript-eslint/no-explicit-any */
let defaultValueId = 0
const defaultValueMap = new Map()
const converts: Record<string, string> = {
    'java.lang.Boolean': 'Boolean',
    boolean: 'Boolean',
    'java.lang.Integer': 'Number',
    int: 'Number',
    'java.lang.Short': 'Number',
    short: 'Number',
    'java.lang.Double': 'Number',
    double: 'Number',
    'java.lang.Float': 'Number',
    float: 'Number',
}
const REG_GETTER = /^function\s+get/g

function normalizeGeneric(type: { generic?: any[] }) {
    if (!type.generic) return ''
    let str = ''
    for (const item of type.generic) {
        str += '#'
        if (item.isArray) {
            let arrayDepth = item.arrayDepth || 1
            while (arrayDepth--) str += '['
        }
        str += item.type + normalizeGeneric(item)
    }
    return str
}

function normalizeUniqId(info: any, version: any) {
    let type = info.type || info.$class || info.$abstractClass
    if (info.isArray) {
        let arrayDepth = info.arrayDepth || 1
        while (arrayDepth--) type = '[' + type
    }
    let fnKey = type
    fnKey += normalizeGeneric(info)
    if (info.defaultValue !== undefined) {
        if (!defaultValueMap.has(info.defaultValue)) {
            defaultValueMap.set(info.defaultValue, defaultValueId++)
        }
        fnKey += '#' + defaultValueMap.get(info.defaultValue)
    }
    fnKey += '#' + version
    return fnKey
}

function normalizeType(type: any) {
    if (typeof type === 'string') {
        return { type }
    }
    return type
}

function getterStringify(fn: any) {
    return fn.toString().replace(REG_GETTER, 'get')
}

function has(obj: any, prop: string) {
    const hasProperty = Object.prototype.hasOwnProperty.call(obj, prop)
    return hasProperty && obj[prop] !== undefined
}

const utils = {
    normalizeGeneric,
    normalizeUniqId,
    normalizeType,
    getterStringify,
    has,
    converts,
}

export default utils
