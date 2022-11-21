import {
    BooleanRecord,
    DateRecord,
    EnumRecord,
    ListRecord,
    ModifiedRecord,
    NumberRecord,
    StringRecord,
} from '../models/awsEvent';
import { logWarning } from '../utils';

export function getString(
    value: StringRecord | undefined,
    propertyName = '',
): string | undefined {
    if (!value) {
        logWarning(`Missing String value ${propertyName}`);
        return '';
    }

    return value.S;
}

export function getBoolean(
    value: BooleanRecord | undefined,
    propertyName = '',
): boolean | undefined {
    if (!value) {
        logWarning(`Missing String value ${propertyName}`);
        return undefined;
    }

    return value.B;
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
    defaultValue = undefined as Date,
): Date | undefined {
    if (!value && !defaultValue) {
        logWarning(`Missing Date value ${propertyName}`);
        return defaultValue;
    }

    const dateValue = getString(value, propertyName);

    if (!dateValue) {
        return defaultValue;
    }
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
        return [];
    }

    return value.L ?? [];
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
