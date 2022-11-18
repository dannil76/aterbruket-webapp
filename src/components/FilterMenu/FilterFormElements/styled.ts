import styled from 'styled-components';

export const InputGroup = styled.div<{ justifyContent: string }>`
    color: ${(props) => props.theme.colors.dark};
    font-weight: 500;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: ${(props) => props.justifyContent};

    background-color: ${(props) => props.theme.colors.grayLighter};
    width: 350px;
    height: 56px;
    border-radius: 4.5px;
    margin: 16px 0px 16px 0px;

    .radioWrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    label.radioLabel {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
    }

    label.active {
        justify-content: flex-start;
    }

    .labelText {
        ${(props) => props.theme.colors.dark};
        font-weight: 500;
    }

    svg {
        font-size: 14px;
        padding-left: 2px;
        color: ${(props) => props.theme.colors.primaryLight};
    }

    span {
        font-size: 18px;
        margin-left: 4px;
    }

    .extra-margin-left {
        margin-left: 19px;
    }

    .active {
        font-weight: 900;
        color: ${(props) => props.theme.colors.darker};
    }

    input[type='checkbox']:checked,
    &:focus {
        border: 2px solid ${(props) => props.theme.colors.grayLighter};
        background-color: ${(props) => props.theme.colors.primaryLight};
        outline: none;
    }
`;

export const CheckboxInput = styled.input`
    appearance: none;
    border: 2px solid ${(props) => props.theme.colors.illustration};
    border-radius: 4px;

    width: 18px;
    height: 18px;
    margin: 19px;
`;

export const RadioInput = styled.input.attrs(() => ({
    type: 'radio',
}))<{ hideOnSelect?: boolean }>`
    appearance: none;
    border: 2px solid ${(props) => props.theme.colors.illustration};
    border-radius: 100%;
    width: 18px;
    height: 18px;
    margin: 19px;

    &:checked,
    &:focus {
        ${(props) =>
            props.hideOnSelect
                ? `
                    appearance: none;
                    outline: none;
                    border: none;
            `
                : `
                    border: 2px solid ${props.theme.colors.grayLighter};
                    background-color: ${props.theme.colors.primaryLight};
                    outline: none;
        `}
    }
`;

export const HiddenInput = styled.input`
    appearance: none;
    outline: none;
    border: none;
`;

export const Label = styled.label<{ justifyContent: string }>`
    font-weight: 500;
    width: 100%;
    display: flex;
    justify-content: ${(props) => props.justifyContent};
    align-items: center;
`;

export const Divider = styled.div`
    width: 71px;
    height: 2px;
    margin-top: 15px;
    background-color: ${(props) => props.theme.colors.primaryLighter};
`;

export const GroupContainer = styled.div`
    width: 350px;
    height: 100%;
    margin-bottom: 3px;

    h2 {
        font-size: 12px;
        font-weight: 900;
        color: ${(props) => props.theme.colors.darker};
        margin-block-end: 0;
        letter-spacing: 0.5px;
    }
`;

export const GroupRadio = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-right: 16px;

    width: 42px;
    height: 24px;
    border-radius: 23px;
    border: 2px solid ${(props) => props.theme.colors.illustration};

    label {
        height: 22px;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }
`;
