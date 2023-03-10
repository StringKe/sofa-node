/* eslint-disable @typescript-eslint/ban-types */
declare module 'hessian.js' {
  function decode(buf: any, version: string, options: any): any
  function decode(buf: any, options: any, version: string): any

  function encode(obj: any, version: string): any

  const encoderV1: any
  const encoderV2: any
  const DecoderV2: any
  const EncoderV2: any

  export {decode, encode, DecoderV2, EncoderV2, encoderV1, encoderV2}
}
