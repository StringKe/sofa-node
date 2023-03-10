import { TypeGenFn } from '../types'

const transform: TypeGenFn = (gen) => {
    gen('if (obj && obj.$class) { obj = obj.$; }')
    gen('if (obj == null) { return encoder.writeNull(); }')
    gen("if (typeof obj === 'number') { obj = obj.toString(); }")
    gen('encoder.writeString(obj);')
}

export default transform
