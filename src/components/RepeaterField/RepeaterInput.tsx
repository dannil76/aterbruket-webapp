import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { MdAdd } from "react-icons/md";
import Input from "../Input";
import { useRepeaterFieldContext } from "./RepeaterFieldContext";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 4.5px;
  background-color: ${(props) => props.theme.colors.grayLight};
`;

const RepeaterInputField = styled(Input)`
  flex-grow: 2;
  background-color: ${(props) => props.theme.colors.grayLight};
`;

const Button = styled.button`
  background-color: transparent;
  cursor: pointer;
  border: none;
  padding: 0 16px;
  svg {
    color: ${(props) => props.theme.colors.primaryLight};
    font-size: 24px;
  }
`;

export interface RepeaterInputInterface {
  [x: string]: unknown;
}

const RepeaterInput: FunctionComponent = ({ children, ...otherProps }) => {
  const { inputValue, setInputValue, addItem } = useRepeaterFieldContext();
  return (
    <Container>
      <RepeaterInputField
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        {...otherProps}
      />
      <Button type="button" onClick={addItem}>
        <MdAdd />
      </Button>
    </Container>
  );
};

export { RepeaterInput };
