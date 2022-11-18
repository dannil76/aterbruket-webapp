/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC } from 'react';
import {
    FaArrowCircleDown,
    FaArrowCircleUp,
    FaArrowDown,
    FaArrowUp,
} from 'react-icons/fa';
import { SortSelection, SortValue, sortValues } from '../../../models/sort';
import {
    Divider,
    GroupContainer,
    GroupRadio,
    InputGroup,
    HiddenInput,
    RadioInput,
} from './styled';
import {
    ascending,
    descending,
    mapNewSelection,
    mapSortValueToSelection,
} from './utils';

interface Props {
    setNewSortSelection: React.Dispatch<React.SetStateAction<SortSelection>>;
    groupTitle: string;
    sortSelection: SortSelection;
}

const SortRadioButtons: FC<Props> = ({
    setNewSortSelection,
    groupTitle,
    sortSelection,
}: Props) => {
    const handleToggle = (value: SortValue) => {
        setNewSortSelection(
            mapNewSelection(sortSelection, sortSelection.direction, value),
        );
    };

    const handleInputChange = (value: SortValue) => {
        if (value.id === sortSelection.id) {
            handleToggle(value);
            return;
        }
        setNewSortSelection(
            mapSortValueToSelection(sortSelection.direction, value),
        );
    };

    const handleRadioInput = (
        event: React.ChangeEvent<HTMLInputElement>,
        sortValue: SortValue,
    ) => {
        if (sortValue.id === sortSelection.id) {
            handleToggle(sortValue);
            return;
        }

        setNewSortSelection(
            mapSortValueToSelection(sortSelection.direction, sortValue),
        );
    };

    const radio = sortValues.map((element) => {
        return (
            <InputGroup justifyContent="space-between" key={element.title}>
                <div
                    className={
                        element.id !== sortSelection.id
                            ? 'flexGroup radioWrapper'
                            : 'flexGroupNotActive radioWrapper'
                    }
                >
                    <label
                        className={
                            element.id === sortSelection.id
                                ? 'active radioLabel extra-margin-left'
                                : 'radioLabel extra-margin-left'
                        }
                        htmlFor={element.title}
                    >
                        {element.title}
                        {element.id === sortSelection.id && ': '}

                        <span className="labelText">
                            {element.id === sortSelection.id &&
                                descending(sortSelection) &&
                                element.descendingText}
                            {element.id === sortSelection.id &&
                                ascending(sortSelection) &&
                                element.ascendingText}
                        </span>

                        <RadioInput
                            hideOnSelect
                            id={element.title}
                            name="sortingMaster"
                            value={element.title}
                            onClick={() => handleToggle(element)}
                            onChange={(e) => handleRadioInput(e, element)}
                            checked={element.id === sortSelection.id}
                        />
                    </label>
                </div>
                {element.id === sortSelection.id && (
                    <GroupRadio>
                        <label
                            htmlFor={`+${element.id}`}
                            className="radioLabel"
                            style={{
                                color: descending(sortSelection)
                                    ? '#80B14A'
                                    : '#6F9725',
                            }}
                        >
                            {descending(sortSelection) ? (
                                <FaArrowCircleUp />
                            ) : (
                                <FaArrowUp />
                            )}

                            <HiddenInput
                                type="radio"
                                id={`+${element.id}`}
                                name="sorting"
                                value={element.title}
                                onChange={() => handleInputChange(element)}
                                checked={descending(sortSelection)}
                            />
                        </label>
                        <label
                            className="radioLabel"
                            htmlFor={`-${element.id}`}
                            style={{
                                color: ascending(sortSelection)
                                    ? '#80B14A'
                                    : '#6F9725',
                            }}
                        >
                            {ascending(sortSelection) ? (
                                <FaArrowCircleDown />
                            ) : (
                                <FaArrowDown />
                            )}

                            <HiddenInput
                                type="radio"
                                id={`-${element.id}`}
                                name="sorting"
                                value={element.title}
                                onChange={() => handleInputChange(element)}
                                checked={ascending(sortSelection)}
                            />
                        </label>
                    </GroupRadio>
                )}
            </InputGroup>
        );
    });

    return (
        <>
            <GroupContainer>
                <h2>{groupTitle}</h2>
                <Divider />
                {radio}
            </GroupContainer>
        </>
    );
};

export default SortRadioButtons;
