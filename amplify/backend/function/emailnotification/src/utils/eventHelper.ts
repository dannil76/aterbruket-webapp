import {
    DateRecord,
    EnumRecord,
    ListRecord,
    ModifiedRecord,
    NumberRecord,
    StringRecord,
} from '../models/awsEvent';
import { logWarning } from './logHelper';

export function getString(value: StringRecord | undefined): string {
    if (!value) {
        logWarning("missing string value")
        return '';
    }

    return value.S;
}

export function getNumber(value: NumberRecord | undefined): number {
    if (!value) {
        logWarning("missing number value")
        return -1;
    }

    const parsed = parseInt(value.N, 10);
    return Number.isNaN(parsed) ? -1 : parsed;
}

export function getDate(value: DateRecord | undefined): Date {
    if (!value) {
        logWarning("missing date value")
        return new Date(0); // TODO
    }

    const parsed = Date.parse(value.S);

    return Number.isNaN(parsed) ? new Date(0) : new Date(parsed); // TODO
}

export function getList<T>(value: ListRecord<T> | undefined): T[] {
    if (!value) {
        logWarning("missing list value")
        return [] as T[];
    }

    return value.L as T[];
}

export function getEnum<T>(value: EnumRecord<T> | undefined): T | undefined {
    if (!value) {
        return undefined;
    }

    return value.S as T;
}

export function getModel<T>(
    value: ModifiedRecord<T> | undefined,
): T | undefined {
    if (!value) {
        logWarning("missing object value")
        return undefined;
    }

    return value.M as T;
}
