import { TypeGenFn } from '../types'
import { default as Boolean } from './boolean'
import { default as Double } from './double'
import { default as Int } from './int'
import { default as JavaLangBoolean } from './java.lang.boolean'
import { default as JavaLangClass } from './java.lang.class'
import { default as JavaLangDouble } from './java.lang.double'
import { default as JavaLangException } from './java.lang.exception'
import { default as JavaLangInteger } from './java.lang.integer'
import { default as JavaLangLong } from './java.lang.long'
import { default as JavaLangObject } from './java.lang.object'
import { default as JavaLangStackTraceElement } from './java.lang.stacktraceelement'
import { default as JavaLangString } from './java.lang.string'
import { default as JavaMathBigDecimal } from './java.math.bigdecimal'
import { default as JavaUtilArrayList } from './java.util.arraylist'
import { default as JavaUtilConcurrentAtomicAtomicLong } from './java.util.concurrent.atomic.atomiclong'
import { default as JavaUtilCurrency } from './java.util.currency'
import { default as JavaUtilDate } from './java.util.date'
import { default as JavaUtilList } from './java.util.list'
import { default as JavaUtilLocale } from './java.util.locale'
import { default as JavaUtilMap } from './java.util.map'
import { default as JavaUtilSet } from './java.util.set'
import { default as Long } from './long'

const TypeMap: Record<string, TypeGenFn> = {
    [`bool`]: Boolean,
    [`boolean`]: Boolean,
    [`java.lang.Boolean`]: JavaLangBoolean,
    [`int`]: Int,
    [`java.lang.Integer`]: JavaLangInteger,
    [`short`]: Int,
    [`java.lang.Short`]: JavaLangInteger,

    [`long`]: Long,
    [`java.lang.Long`]: JavaLangLong,

    [`double`]: Double,
    [`java.lang.Double`]: JavaLangDouble,
    [`float`]: Double,

    [`byte`]: Int,
    [`java.lang.Byte`]: JavaLangInteger,

    [`char`]: JavaLangString,
    [`java.lang.Character`]: JavaLangString,
    [`java.lang.String`]: JavaLangString,

    [`java.util.Map`]: JavaUtilMap,
    [`java.util.HashMap`]: JavaUtilMap,

    [`java.util.List`]: JavaUtilList,
    [`java.util.Set`]: JavaUtilSet,
    [`java.util.Collection`]: JavaUtilList,
    [`java.util.ArrayList`]: JavaUtilArrayList,

    [`java.util.Date`]: JavaUtilDate,

    [`java.lang.Class`]: JavaLangClass,
    [`java.util.Currency`]: JavaUtilCurrency,

    [`java.math.BigDecimal`]: JavaMathBigDecimal,
    [`java.util.Locale`]: JavaUtilLocale,
    [`java.lang.Exception`]: JavaLangException,
    [`java.lang.StackTraceElement`]: JavaLangStackTraceElement,
    [`java.lang.Object`]: JavaLangObject,
    [`java.util.concurrent.atomic.AtomicLong`]:
        JavaUtilConcurrentAtomicAtomicLong,
}
export default TypeMap
