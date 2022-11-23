import { ReactNode } from 'react';
import styled from 'styled-components';

const fieldHeight = '56px';
const labelFontSize = '14px';

export const FormContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 50px;

    form {
        padding-top: 16px;
        display: flex;
        flex-direction: column;
        background-color: ${(props) => props.theme.colors.white};
    }

    input[type='file'] {
        white-space: break-spaces;
        padding: 0;
        background: transparent;
        height: 80px;

        ::-webkit-file-upload-button {
            background: ${(props) => props.theme.colors.grayLighter};
            color: black;
            width: 100%;
            height: ${fieldHeight};
            border: none;
            padding: 3px;
            font-weight: 500;
            font-size: 18px;
            margin-bottom: 3px;
        }
    }
`;

export const FieldDescription = styled.p`
    margin: 0;
    margin-left: 8px;
    color: ${(props) => props.theme.colors.dark};
    font-style: italic;
    font-size: 16px;
`;

interface FieldSectionProps {
    inlineLabel?: boolean;
}

export const FieldSection = styled.section<FieldSectionProps>`
    display: flex;
    justify-content: space-around;
    flex-direction: column;

    padding: 4px 16px 4px 16px;
    margin: 0px 0px 16px 0px;

    ${FieldDescription} {
        margin-top: 16px;
    }

    h4 {
        margin-left: 8px;
        font-style: normal;
        font-weight: bold;
        font-size: 18px;
        line-height: 112%;
        color: ${(props) => props.theme.colors.darkest};
    }

    textarea,
    select {
        border-radius: 4.5px;
        border: none;
        font-size: 16px;
        height: ${fieldHeight};
        padding: 0 0 0 24px;
        background-color: ${(props) => props.theme.colors.grayLighter};
        ::placeholder {
            font-style: italic;
            color: #a3a3a3;
        }
    }

    textarea {
        padding: 16px 0 0 24px;
        height: 192px;
        ::placeholder {
            font-family: 'Roboto';
            color: #a3a3a3;
        }
    }
    select:invalid {
        font-style: italic;
        color: #a3a3a3;
    }

    input[type='radio'] {
        height: auto;
    }

    ${({ inlineLabel, theme }) =>
        inlineLabel &&
        `
            position: relative;

            input {
            text-align: right;
            padding: 0 10px 0 24px;
            }

            label {
            margin: 0;
            position: absolute;
            top: calc(${fieldHeight} / 2 - ${labelFontSize} / 2);
            left: 40px;
            font-style: normal;
            font-weight: bold;
            text-transform: none;

            color: ${theme.colors.darkest};
            }

            select {
                height: ${fieldHeight};
                padding-left: 100px;
                padding-right: 10px;
                option {
                    direction: rtl;
                }
            }
        `}
`;

interface MultipleChoiceDivProps {
    direction?: string;
    reverse?: boolean;
    checked?: boolean;
}

export const MultipleChoiceContainer = styled.div<MultipleChoiceDivProps>`
    background-color: ${(props) => props.theme.colors.grayLighter};
    display: flex;
    border-radius: 4.5px;

    > div {
        display: flex;
        box-sizing: border-box;
    }

    ${({ direction }) =>
        direction === 'row' &&
        `
    justify-content: space-around;
    align-items: center;

    > div {
      padding: 16px;
      flex-direction: column-reverse;
      justify-content: center;
    }

    label {
      margin: 0;
    }
  `}

    ${({ direction, reverse }) =>
        direction === 'column' &&
        `
    flex-direction: column;
    align-items: flex-start;

    > div {
      width: 100%;
      padding: 12px 16px;

      label {
        margin: 0 0 0 4px;
      }
    }

    ${
        reverse &&
        `
    > div {
      flex-direction: row-reverse;
      justify-content: space-between;

      label {
        margin: 0px;
      }
    }`
    }
  `}
`;

export const ActionsContainer = styled.div`
    margin: 32px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const LabelWrapper = styled.label`
    color: ${(props) => props.theme.colors.primary};
    letter-spacing: 0.005em;
    padding-bottom: 2px;
    font-style: normal;
    font-weight: 900;
    font-size: ${labelFontSize};
    line-height: 150%;
    text-transform: uppercase;
    margin: 0px 8px 8px 8px;

    span {
        color: ${(props) => props.theme.colors.darkest};
    }
`;

export interface LabelProps {
    required?: boolean;
    children: ReactNode;
    [x: string]: unknown;
}

export const CheckboxLabel = styled.label<LabelProps>`
    color: ${(props) => props.theme.colors.monoLight};
    text-transform: none;
    font-weight: 500;
    font-size: 16px;

    color: ${(props) =>
        props.checked
            ? props.theme.colors.darkest
            : props.theme.colors.monoLight};
`;

export const LayoutSection = styled(FieldSection)`
    margin: 0px;
    padding: 0px 16px 0px 16px;

    ${FieldDescription} {
        margin-top: 0px;
        margin-bottom: 16px;
    }
`;
