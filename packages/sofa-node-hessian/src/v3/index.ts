import {
    decode,
    DecoderV2,
    encoderV1,
    encoderV2,
    EncoderV2,
} from 'hessian.js-1'

import compile from './compile'

export default {
    encode: (
        obj: any,
        version: string,
        classMap: Record<string, any> | null,
        appClassMap?: any,
        options?: any,
    ) => {
        const encoder = version === '2.0' ? encoderV2 : encoderV1
        encoder.reset()
        if (classMap) {
            const fn = compile(obj, version, classMap, options)
            fn(obj.$, encoder, appClassMap)
        } else {
            encoder.write(obj)
        }
        return encoder.get()
    },
    decode,
    compile,
    Encoder: EncoderV2,
    Decoder: DecoderV2,
}
