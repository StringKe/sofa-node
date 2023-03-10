import { TypeGenFn } from '../types'

const transform: TypeGenFn = (gen) => {
    gen('if (obj && obj.$class) { obj = obj.$; }')
    gen('if (obj == null) { obj = 0; }')
    gen('encoder.writeLong(obj);')
}

export default transform
