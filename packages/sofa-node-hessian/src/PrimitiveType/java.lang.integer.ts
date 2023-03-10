import { TypeGenFn } from '../types'

const transform: TypeGenFn = (gen) => {
    gen('if (obj && obj.$class) { obj = obj.$; }')
    gen('if (obj == null) { return encoder.writeNull(); }')
    gen("if (typeof obj == 'string') {")
    gen('  const val = parseInt(obj, 10);')
    gen('  if (!isNaN(val)) {')
    gen('    obj = val;')
    gen('  }')
    gen('}')
    gen('encoder.writeInt(obj);')
}

export default transform
