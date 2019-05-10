import 'reflect-metadata';
import { Type } from '@angular/core';
import { TimeHelper } from 'shared/helpers/time.helper';

const primitiveSymbol = Symbol('primitiveSymbol');
const objectSymbol = Symbol('objectSymbol');
const objectMapperSymbol = Symbol('objectMapperSymbol');
const arraySymbol = Symbol('arraySymbol');
const arrayMapperSymbol = Symbol('arrayMapperSymbol');
const valueSymbol = Symbol('valueSymbol');
const timeSymbol = Symbol('timeSymbol');

export class ClassHelper {
    private static readonly TYPES = {
        PRIM: 'prim',
        OBJ: 'obj',
        VAL: 'val',
        TYPED_ARR: 'typed_arr',
        MAPPED_ARR: 'mapped_arr',
        TIME: 'time'
    };

    private static isType (symbol, target, prop: string) {
        return Reflect.hasMetadata(symbol, target, prop);
    }

    private static getMappedType (target, propertyKey: string, element) {
        const symbol = this.isType(objectMapperSymbol, target, propertyKey) ? objectMapperSymbol : arrayMapperSymbol;
        const objectMapper = Reflect.getMetadata(symbol, target, propertyKey);
        return objectMapper.mapper[element[objectMapper.key]];
    }

    private static getMetadata (symbol: symbol, target, prop: string) {
        const type = Reflect.getMetadata(symbol, target, prop);
        if (symbol !== primitiveSymbol) {
            return type;
        }

        if (type instanceof Type) {
            return type;
        } else {
            return Reflect.getMetadata('design:type', target, prop);
        }
    }

    private static getType (isPrim: boolean, isObj: boolean, isVal: boolean, isTypedArr: boolean,
                            isMappedArr: boolean, isTime: boolean): string {
        if (isPrim) {
            return this.TYPES.PRIM;
        } else if (isObj) {
            return this.TYPES.OBJ;
        } else if (isVal) {
            return this.TYPES.VAL;
        } else if (isTypedArr) {
            return this.TYPES.TYPED_ARR;
        } else if (isMappedArr) {
            return this.TYPES.MAPPED_ARR;
        } else if (isTime) {
            return this.TYPES.TIME;
        }
        return null;
    }

    static assign<T> (target: T, source?): T {
        for (const prop in source) {
            if (!source.hasOwnProperty(prop) && source[prop] === undefined) {
                continue;
            } else if (source[prop] === null) {
                target[prop] = null;
                continue;
            }

            const isPrim = this.isType(primitiveSymbol, target, prop);
            const isTime = this.isType(timeSymbol, target, prop);
            const isObj = this.isType(objectSymbol, target, prop) ||
                this.isType(objectMapperSymbol, target, prop) && typeof source[prop] === 'object';
            const isVal = this.isType(valueSymbol, target, prop) && typeof source[prop] === 'string';
            const isTypedArr = this.isType(arraySymbol, target, prop) && Array.isArray(source[prop]);
            const isMappedArr = this.isType(arrayMapperSymbol, target, prop) && Array.isArray(source[prop]);
            const type: string = this.getType(isPrim, isObj, isVal, isTypedArr, isMappedArr, isTime);
            let arrayType;

            switch (type) {
                case this.TYPES.PRIM:
                    const primitiveType = this.getMetadata(primitiveSymbol, target, prop);
                    target[prop] = primitiveType(source[prop]);
                    break;
                case this.TYPES.TIME:
                    target[prop] = TimeHelper.getTime(source[prop]);
                    break;
                case this.TYPES.OBJ:
                    const objectType = this.isType(objectSymbol, target, prop) ?
                        this.getMetadata(objectSymbol, target, prop) :
                        this.getMappedType(target, prop, source[prop]);
                    target[prop] = new objectType(source[prop]);
                    break;
                case this.TYPES.VAL:
                    const valueType = this.getMetadata(valueSymbol, target, prop);
                    target[prop] = valueType.of && typeof valueType.of === 'function' ? valueType.of(source[prop]) : undefined;
                    break;
                case this.TYPES.TYPED_ARR:
                    arrayType = this.getMetadata(arraySymbol, target, prop);
                    const isPrimitive = arrayType === String || arrayType === Number || arrayType === Boolean;
                    if (isPrimitive) {
                        target[prop] = source[prop].map(element => isAbsent(element) ? element : arrayType(element));
                    } else {
                        target[prop] = source[prop].map(element => isAbsent(element) ? element : new arrayType(element));
                    }
                    break;
                case this.TYPES.MAPPED_ARR:
                    target[prop] = source[prop].map(element => {
                        arrayType = this.getMappedType(target, prop, element);
                        if (isPresent(element) && isPresent(arrayType)) {
                            return new arrayType(element);
                        }
                        return element;
                    });
                    break;
                default:
                    target[prop] = source[prop];
                    break;
            }
        }
        return target;
    }
}

export function primitive<T> (type?: Type<T>) {
    return Reflect.metadata(primitiveSymbol, type || true);
}

export function time () {
    return Reflect.metadata(timeSymbol, true);
}

export function primitiveOf<T> (type: Type<T>) {
    return Reflect.metadata(primitiveSymbol, type);
}

export function objectOf<T> (type: Type<T>) {
    return Reflect.metadata(objectSymbol, type);
}

export function arrayOf<T> (type: Type<T>) {
    return Reflect.metadata(arraySymbol, type);
}

export function isPresent (value): boolean {
    return value !== undefined && value !== null;
}

export function isAbsent (value): boolean {
    return !isPresent(value);
}
