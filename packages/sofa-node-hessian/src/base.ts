import { Codegen, CompileInner, CompileSerialize } from './types'
import utils from './utils'

export function parseGenericTypeVar(generic: any[], info: any) {
    const newGeneric = []
    for (const genericItem of generic) {
        let newType = genericItem
        if (
            genericItem.typeVar === true &&
            utils.has(genericItem, 'typeAliasIndex') &&
            Array.isArray(info.generic)
        ) {
            newType = Object.create(
                null,
                Object.getOwnPropertyDescriptors(
                    info.generic[genericItem.typeAliasIndex],
                ),
            )
        }

        // recursive handle
        if (Array.isArray(genericItem.generic)) {
            newType.generic = parseGenericTypeVar(genericItem.generic, info)
        }
        newGeneric.push(newType)
    }
    return newGeneric
}

export function compileProp(
    gen: Codegen,
    info: any,
    key: string,
    classInfo: any,
    version: string,
    options: any,
) {
    const attr = Object.create(
        null,
        Object.getOwnPropertyDescriptors(classInfo[key]),
    )

    // generic param pass handle
    if (Array.isArray(attr.generic)) {
        attr.generic = parseGenericTypeVar(attr.generic, info)
    }

    if (utils.has(attr, 'typeAliasIndex') && Array.isArray(info.generic)) {
        const refType = info.generic[attr.typeAliasIndex]
        attr.type = refType.type
        if (refType.generic) attr.generic = refType.generic
        if (refType.isArray) attr.isArray = refType.isArray
        if (refType.isMap) attr.isMap = refType.isMap
        if (refType.isEnum) attr.isEnum = refType.isEnum
        if (refType.arrayDepth) attr.arrayDepth = refType.arrayDepth
    }
    const uniqueId = utils.normalizeUniqId(attr, version)
    const desc = Object.getOwnPropertyDescriptor(attr, 'defaultValue')
    if (!desc) {
        gen(
            "compile('%s', %j, classMap, version, %j)(obj['%s'], encoder, appClassMap);",
            uniqueId,
            attr,
            options,
            key,
        )
    } else {
        Object.defineProperty(
            attr,
            'defaultValue',
            Object.assign({}, desc, { enumerable: false }),
        )
        const dv = desc.get
            ? `({ ${utils.getterStringify(desc.get)} }).defaultValue`
            : JSON.stringify(desc.value)

        gen(
            "compile('%s', %j, classMap, version, %j)(utils.has(obj, '%s') ? obj['%s'] : %s, encoder, appClassMap);",
            uniqueId,
            attr,
            options,
            key,
            key,
            dv,
        )
    }
}
