import './hessian.js-1'
import './hessian.js'

export type Codegen = (
    formatStringOrScope?: string | { [k: string]: any },
    ...formatParams: any[]
) => // eslint-disable-next-line @typescript-eslint/ban-types
Codegen | Function

export declare type TypeGenFn = (
    gen: Codegen,
    info: any,
    version: any,
    options: any,
) => void

export declare type CompileSerialize = {
    (
        info: any,
        version: string,
        classMap: Record<string, any>,
        options?: any,
    ): Codegen
    classMapCacheOn: symbol
    cache: Map<any, any>
    setCache: (cache: Map<any, any>) => void
    getCache: () => Map<any, any>
    setDebugOptions: (enable: boolean, dir?: string) => void
    getDebugOptions: () => { enable: boolean; dir?: string }
    getCompileCache: (classMap?: Record<string, any> | null) => Map<string, any>
}

export declare type CompileInner = (
    uniqueId: string,
    info: any,
    classMap?: Record<string, any> | null,
    version?: string,
    options?: any,
) => CompileSerialize
