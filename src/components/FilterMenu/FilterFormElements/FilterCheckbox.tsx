import React, { FC } from 'react';
import { IOption } from '../../../interfaces/IForm';
import {
    CheckboxInput,
    Divider,
    GroupContainer,
    InputGroup,
    Label,
} from './styled';
import { add, isSelected, remove } from './utils';

interface Props {
    title: string;
    options: IOption[];
    selected: string[];
    setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterCheckbox: FC<Props> = ({
    setSelected,
    selected,
    options,
    title,
}: Props) => {
    const handleChange = (value: string, checked: boolean) => {
        const updated = checked
            ? add(selected, value)
            : remove(selected, value);

        setSelected(updated);
    };

    const checkboxes = options.map((element: IOption) => {
        return (
            <InputGroup justifyContent="flex-start" key={element.id}>
                <Label
                    justifyContent="flex-start"
                    htmlFor={`${element.id}-${element.key}`}
                    className={
                        isSelected(selected, element.key) ? 'active' : ''
                    }
                >
                    <CheckboxInput
                        type="checkbox"
                        id={`${element.id}`}
                        name={`${element.id}-${element.key}`}
                        onChange={(e) =>
                            handleChange(element.key, e.target.checked)
                        }
                        checked={isSelected(selected, element.key)}
                    />

                    {element.title}
                </Label>
            </InputGroup>
        );
    });

    return (
        <GroupContainer>
            <h2>{title.toUpperCase()}</h2>
            <Divider
                style={{
                    width: title === 'Skick' ? '37px' : '92px',
                }}
            />
            {checkboxes}
        </GroupContainer>
    );
};

export default FilterCheckbox;
