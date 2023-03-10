import { TypeGenFn } from '../types'

const transform: TypeGenFn = (gen, classInfo, version, options) => {
    gen('if (obj == null) { return encoder.writeNull(); }')
    gen('if (obj && obj.$class) {')
    gen('  const fnKey = utils.normalizeUniqId(obj, version);')
    gen(
        '  compile(fnKey, obj, appClassMap, version, %j)(obj.$, encoder);',
        options,
    )
    gen('} else {')
    gen('  encoder.write(obj);')
    gen('}')
}

export default transform
