import { TypeGenFn } from '../types'

const transform: TypeGenFn = (gen) => {
    gen('if (obj && obj.$class) { obj = obj.$; }')
    gen('if (obj == null) { obj = false; }')
    gen('encoder.writeBool(obj);')
}

export default transform
