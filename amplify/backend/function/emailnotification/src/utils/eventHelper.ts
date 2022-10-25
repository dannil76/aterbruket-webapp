import {
    DateRecord,
    EnumRecord,
    ListRecord,
    ModifiedRecord,
    NumberRecord,
    StringRecord,
} from '../models/awsEvent';
import { logWarning } from './logHelper';

export function getString(
    value: StringRecord | undefined,
    propertyName = '',
): string {
    if (!value) {
        logWarning(`Missing String value ${propertyName}`);
        return '';
    }

    return value.S;
}

export function getNumber(
    value: NumberRecord | undefined,
    propertyName = '',
): number {
    if (!value) {
        logWarning(`Missing Number value ${propertyName}`);
        return -1;
    }

    const parsed = parseInt(value.N, 10);
    return Number.isNaN(parsed) ? -1 : parsed;
}

export function getDate(
    value: DateRecord | undefined,
    propertyName = '',
): Date {
    if (!value) {
        logWarning(`Missing Date value ${propertyName}`);
        return new Date(0); // TODO
    }

    const dateValue = getString(value, propertyName);

    const parsed = Date.parse(dateValue);

    if (Number.isNaN(parsed)) {
        logWarning(`Could not parse ${propertyName} date value ${dateValue}`);
        return new Date(0);
    }
    return new Date(parsed);
}

export function getList<T>(
    value: ListRecord<T> | undefined,
    propertyName = '',
): T[] {
    if (!value) {
        logWarning(`Missing List value ${propertyName}`);
        return [] as T[];
    }

    return value.L as T[];
}

export function getEnum<T>(
    value: EnumRecord<T> | undefined,
    propertyName = '',
): T | undefined {
    if (!value) {
        logWarning(`Missing Enum value ${propertyName}`);
        return undefined;
    }

    return value.S as T;
}

export function getModel<T>(
    value: ModifiedRecord<T> | undefined,
    propertyName = '',
): T | undefined {
    if (!value) {
        logWarning(`Missing Model value ${propertyName}`);
        return undefined;
    }

    return value.M as T;
}
