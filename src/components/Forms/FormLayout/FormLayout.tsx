/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { IDateRange } from '../../../interfaces/IDateRange';
import { IFields, IOption } from '../../../interfaces/IForm';
import compare from '../../../utils/compare';
import Button from '../../Button';
import DateRangePicker from '../../DateRangePicker';
import Input from '../../Input';
import RepeaterField from '../../RepeaterField';
import {
    ActionsContainer,
    CheckboxLabel,
    FieldDescription,
    FieldSection,
    FormContainer,
    LabelProps,
    LabelWrapper,
    LayoutSection,
    MultipleChoiceContainer,
} from './styled';

const Label: React.FC<LabelProps> = ({ required, children, ...props }) => {
    return (
        <LabelWrapper {...props}>
            {children}
            {required && <span className="required">{` *`}</span>}
        </LabelWrapper>
    );
};

export default function FormLayout(props: {
    values: any;
    fields: IFields[];
    mutation: string;
    handleInputChange: (event: React.ChangeEvent<any>) => void;
    handleCheckboxChange: (event: React.ChangeEvent<any>, data: any) => void;
    handleDateRangeChange: (
        changeEvent: IDateRange,
        bookingType: string,
    ) => void;
    handleSetValue: (value: string | string[], key: string) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) {
    const fields = props.fields.map((field: IFields) => {
        if (field.conditions !== undefined) {
            let isVisible = true;

            field.conditions.forEach((condition: any) => {
                const { field: fieldName, value, operator } = condition;
                isVisible =
                    compare(value, operator, props.values[fieldName]) &&
                    isVisible;
            });

            if (!isVisible) {
                return;
            }
        }

        const required = field.required ?? false;
        const inlineLabel = field.attributes?.inlineLabel ?? false;

        if (field.fieldType === 'checkbox') {
            const data = field.options ? field.options : [];
            const direction = field.attributes?.direction ?? 'column';
            const reverse = field.attributes?.reverse ?? false;

            const checkboxInput = data.map((option: IOption) => {
                return (
                    <div key={option.id}>
                        <input
                            type="checkbox"
                            name={option.key}
                            id={option.key}
                            onChange={(e) =>
                                props.handleCheckboxChange(e, field.name)
                            }
                            checked={props.values[field.name][option.key]}
                            disabled={option.disabled}
                        />
                        <CheckboxLabel
                            htmlFor={option.key}
                            checked={props.values[field.name][option.key]}
                        >
                            {option.title}
                        </CheckboxLabel>
                    </div>
                );
            });
            return (
                <FieldSection key={field.name}>
                    {field.title && (
                        <Label htmlFor={field.name} required={required}>
                            {field.title}
                        </Label>
                    )}
                    <MultipleChoiceContainer
                        direction={direction}
                        reverse={reverse}
                    >
                        {checkboxInput}
                    </MultipleChoiceContainer>
                    {field.description && (
                        <FieldDescription>{field.description}</FieldDescription>
                    )}
                </FieldSection>
            );
        }

        if (field.fieldType === 'textarea') {
            return (
                <FieldSection key={field.name}>
                    <Label htmlFor={field.name} required={required}>
                        {field.title}
                    </Label>
                    <textarea
                        name={field.name}
                        onChange={props.handleInputChange}
                        value={props.values[field.name]}
                        placeholder={field.placeholder}
                        required={field.required}
                        {...field.attributes}
                    />
                    {field.description && (
                        <FieldDescription>{field.description}</FieldDescription>
                    )}
                </FieldSection>
            );
        }

        if (field.fieldType === 'select') {
            const data = field.options ? field.options : [];
            return (
                <FieldSection key={field.name} inlineLabel={inlineLabel}>
                    <Label htmlFor={field.name} required={required}>
                        {field.title}
                    </Label>
                    <select
                        name={field.name}
                        id={field.name}
                        onChange={props.handleInputChange}
                        defaultValue={
                            props.values[field.name]
                                ? props.values[field.name]
                                : ''
                        }
                        required={field.required}
                    >
                        <option value="" disabled>
                            Välj ett alternativ
                        </option>
                        {data.map((option: IOption) => {
                            return (
                                <option value={option.key} key={option.id}>
                                    {option.title}
                                </option>
                            );
                        })}
                    </select>
                    {field.description && (
                        <FieldDescription>{field.description}</FieldDescription>
                    )}
                </FieldSection>
            );
        }

        if (field.fieldType === 'radio') {
            const data = field.options ? field.options : [];
            const direction = field.attributes?.direction ?? 'row';
            const options = data.map((option: IOption) => (
                <div key={option.id}>
                    <input
                        type="radio"
                        id={option.key}
                        name={field.name}
                        value={option.key}
                        checked={props.values[field.name] === option.key}
                        onChange={props.handleInputChange}
                    />
                    <CheckboxLabel
                        htmlFor={option.key}
                        required={false}
                        checked={props.values[field.name] === option.key}
                    >
                        {option.title}
                    </CheckboxLabel>
                </div>
            ));
            return (
                <FieldSection key={field.name}>
                    <Label htmlFor={field.name} required={required}>
                        {field.title}
                    </Label>
                    <MultipleChoiceContainer direction={direction}>
                        {options}
                    </MultipleChoiceContainer>
                </FieldSection>
            );
        }

        if (field.fieldType === 'dateRangePicker') {
            return (
                <FieldSection key={field.name}>
                    <Label htmlFor={field.name} required={required}>
                        {field.title}
                    </Label>
                    <DateRangePicker
                        required={required}
                        onValueChange={props.handleDateRangeChange}
                        bookingType="createNewCalendar"
                        initialStartDate={
                            props.values?.advertBorrowCalendar.allowedDateStart
                        }
                        initialEndDate={
                            props.values?.advertBorrowCalendar.allowedDateEnd
                        }
                    />
                    {field.description && (
                        <FieldDescription>{field.description}</FieldDescription>
                    )}
                </FieldSection>
            );
        }

        if (field.fieldType === 'repeater') {
            return (
                <FieldSection key={field.name}>
                    <Label htmlFor={field.name} required={required}>
                        {field.title}
                    </Label>

                    <RepeaterField
                        setData={(value) =>
                            props.handleSetValue(value, field.name)
                        }
                        data={props.values[field.name]}
                    >
                        {props.values[field.name].length > 0 && (
                            <RepeaterField.ItemsContainer>
                                {props.values[field.name].map(
                                    (item: any, index: number) => (
                                        <RepeaterField.Item
                                            key={`${item}${index}`}
                                            value={item}
                                        />
                                    ),
                                )}
                            </RepeaterField.ItemsContainer>
                        )}
                        <RepeaterField.Input placeholder="Nytt tillbehör" />
                    </RepeaterField>

                    {field.description && (
                        <FieldDescription>{field.description}</FieldDescription>
                    )}
                </FieldSection>
            );
        }

        if (field.fieldType === 'layout') {
            const content = field.attributes?.content ?? [];
            const renderContent = content.map((object: any, key: number) => {
                switch (object.element) {
                    case 'p':
                        return (
                            <p key={key} style={{ paddingLeft: 8 }}>
                                {object.value}
                            </p>
                        );
                    case 'h4':
                        return <h4 key={key}>{object.value}</h4>;
                    case 'i':
                        return (
                            <FieldDescription key={key}>
                                {object.value}
                            </FieldDescription>
                        );
                    case 'label':
                        return (
                            <Label key={key} htmlFor={object.value}>
                                {object.value}
                            </Label>
                        );
                    default:
                        return <div>{object.value}</div>;
                }
            });

            return (
                <LayoutSection key={field.name}>
                    {field.title && (
                        <Label htmlFor={field.name} required={required}>
                            {field.title}
                        </Label>
                    )}
                    <div>{renderContent}</div>
                </LayoutSection>
            );
        }

        const attributes: any = {
            type: field.fieldType,
            name: field.name,
            onChange: props.handleInputChange,
            disabled: field.disabled,
            required: field.required,
            placeholder: field.placeholder,
            ...field.attributes,
        };

        if (props.values[field.name] !== undefined) {
            attributes.value = props.values[field.name];
        }

        return (
            <FieldSection inlineLabel={inlineLabel} key={field.name}>
                <Label htmlFor={field.name} required={required}>
                    {field.title}
                </Label>
                <Input {...attributes} />
                {field.description && (
                    <FieldDescription>{field.description}</FieldDescription>
                )}
            </FieldSection>
        );
    });

    const history = useHistory();

    const goBackFunc = () => {
        history.goBack();
    };

    return (
        <FormContainer>
            <form onSubmit={props.handleSubmit}>
                {fields}
                <ActionsContainer>
                    <Button
                        type="submit"
                        style={{
                            width: '350px',
                            height: '56px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                        }}
                    >
                        Färdig!
                    </Button>
                    <Button
                        type="button"
                        onClick={() => goBackFunc()}
                        transparent
                        style={{
                            fontSize: '16px',
                            color: '#A3A3A3',
                            border: 'none',
                            fontWeight: 'bold',
                        }}
                    >
                        Avbryt
                    </Button>
                </ActionsContainer>
            </form>
        </FormContainer>
    );
}
