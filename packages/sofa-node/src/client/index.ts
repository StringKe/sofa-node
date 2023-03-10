import * as assert from 'assert'

export declare type ClientRequestMetadata = {
    id?: string
    resultCode: string
    connectionGroup?: string
    codecType?: string
    boltVersion?: string
    crcEnable?: boolean
    start: number
    timeout: number
    address?: string
    requestEncodeStart?: number
    requestEncodeRT?: number
    reqSize?: number
    responseDecodeStart?: number
    responseDecodeRT?: number
    resSize?: number
    rt?: number
    error?: Error
}

export declare type ClientRequestOptions = {
    targetAppName?: string
    methodName?: string
    group?: string
    args?: any[]
    timeout?: number
    codecType?: string
    requestProps?: any
    serverSignature?: string
    ctx?: any
}

export class ClientRequest {
    targetAppName: string
    serverSignature?: string
    group?: string
    methodName: string
    args: any[]
    timeout: number
    codecType?: string
    requestProps: any
    ctx: any
    meta: ClientRequestMetadata

    constructor(data: ClientRequestOptions) {
        assert(data.targetAppName, '[RpcRequest] req.targetAppName is required')
        assert(data.methodName, '[RpcRequest] req.methodName is required')
        assert(data.args, '[RpcRequest] req.args is required')
        assert(data.timeout, '[RpcRequest] req.timeout is required')

        this.targetAppName = data.targetAppName
        this.serverSignature = data.serverSignature
        this.group = data.group
        this.methodName = data.methodName
        this.args = data.args
        this.timeout = data.timeout
        this.codecType = data.codecType
        this.requestProps = data.requestProps || {
            service: data.serverSignature,
        }
        this.ctx = data.ctx
        this.meta = {
            id: undefined,
            resultCode: '00',
            connectionGroup: undefined,
            codecType: undefined,
            boltVersion: undefined,
            crcEnable: false,
            start: Date.now(),
            timeout: data.timeout,
            address: undefined,
            requestEncodeStart: 0,
            requestEncodeRT: 0,
            reqSize: 0,
            responseDecodeStart: 0,
            responseDecodeRT: 0,
            resSize: 0,
            rt: undefined,
            error: undefined,
        }
    }
}
