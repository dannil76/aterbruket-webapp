export interface IFields {
  name: string;
  dataType?: string;
  fieldType: string | number;
  disabled: boolean;
  required?: boolean;
  title: string;
  placeholder?: string;
  option?: IOption[];
  swe?: string[] | undefined;
  eng?: string[] | undefined;
  condition?: ConditionLogic | undefined;
}

interface ConditionLogic {
  field: string;
  operator: string;
  value: string | boolean | number;
}

interface IOption {
  name: string;
  swe?: string[] | undefined;
  eng?: string[] | undefined;
}
