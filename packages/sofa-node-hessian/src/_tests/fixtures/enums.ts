export class Enums {
    public enums: any[]

    constructor(items: any[] = []) {
        if (items.constructor.name === 'Enums') {
            items = (items as unknown as Enums).enums
        }
        this.enums = []
        if (!Array.isArray(items)) {
            items = [items]
        }
        for (let i = 0, len = items.length; i < len; i++) {
            let item = items[i]
            if (typeof item === 'string') {
                item = { name: item }
            }
            item.ordinal = i
            Object.defineProperty(item, 'eql', {
                configurable: true,
                enumerable: false,
                value: function (that: any) {
                    if (!that || !that.name) {
                        return false
                    }
                    return this.name === that.name
                },
            })
            // @ts-ignore
            this[item.name] = item
            this.enums.push(item)
        }
    }

    public getByCode(code: any) {
        return this.getBy('code', code)
    }

    public getBy(name: string, val: any) {
        const enums = this.enums
        for (let i = 0, len = enums.length; i < len; i++) {
            const item = enums[i]
            if (item[name] === val) {
                return item
            }
        }
        return null
    }

    public values() {
        return this.enums
    }
}
