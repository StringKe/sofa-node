import { TypeGenFn } from '../types'
import utils from '../utils'

const transform: TypeGenFn = (gen, classInfo, version, options) => {
    gen('if (obj && obj.$class) { obj = obj.$; }')
    gen('if (obj == null) { return encoder.writeNull(); }')
    gen('if (encoder._checkRef(obj)) { return; }')

    classInfo = {
        declaringClass: {
            type: 'java.lang.String',
        },
        methodName: {
            type: 'java.lang.String',
        },
        fileName: {
            type: 'java.lang.String',
        },
        lineNumber: {
            type: 'int',
        },
    }
    const keys = ['declaringClass', 'methodName', 'fileName', 'lineNumber']

    if (version === '1.0') {
        gen('encoder.byteBuffer.put(0x4d);')
        gen("encoder.writeType('java.lang.StackTraceElement');")
        for (const key of keys) {
            gen("encoder.writeString('%s');", key)
            const attr = classInfo[key]
            const uniqueId = utils.normalizeUniqId(attr, version)
            gen(
                "compile('%s', %j, classMap, version, %j)(obj['%s'], encoder);",
                uniqueId,
                attr,
                options,
                key,
            )
        }
        gen('encoder.byteBuffer.put(0x7a);')
    } else {
        gen(
            "const ref = encoder._writeObjectBegin('java.lang.StackTraceElement');",
        )
        gen('if (ref === -1) {')
        gen('encoder.writeInt(%d);', keys.length)
        for (const key of keys) {
            gen("encoder.writeString('%s');", key)
        }
        gen("encoder._writeObjectBegin('java.lang.StackTraceElement'); }")

        for (const key of keys) {
            const attr = classInfo[key]
            const uniqueId = utils.normalizeUniqId(attr, version)
            gen(
                "compile('%s', %j, classMap, version, %j)(obj['%s'], encoder);",
                uniqueId,
                attr,
                options,
                key,
            )
        }
    }
}

export default transform
