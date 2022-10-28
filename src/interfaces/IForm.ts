export interface IFields {
    name: string;
    fieldType: string | number;
    disabled?: boolean;
    required?: boolean;
    imageRequired?: boolean;
    title: string;
    placeholder?: string;
    options?: IOption[];
    conditions?: ConditionLogic[] | undefined;
    description?: string;
    attributes?: Attributes;
}

export interface Attributes {
    [key: string]: any;
}

export interface ConditionLogic {
    field: string;
    operator: string;
    value: string | boolean | number;
}

export interface IOption {
    id: number;
    parent?: number | null;
    key: string;
    title: string;
    disabled?: boolean;
}
