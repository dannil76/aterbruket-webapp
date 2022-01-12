export interface IFields {
  name: string;
  dataType?: string;
  fieldType: string | number;
  disabled: boolean;
  required?: boolean;
  title: string;
  placeholder?: string;
  options?: IOption[];
  condition?: ConditionLogic | undefined;
  description?: string;
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
