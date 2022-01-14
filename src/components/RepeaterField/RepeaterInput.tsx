import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { MdAdd } from "react-icons/md";
import { useRepeaterFieldContext } from "./RepeaterFieldContext";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 2px;

  border-radius: 4.5px;
  background-color: ${(props) => props.theme.colors.lightGray};
`;

const Input = styled.input`
  flex-grow: 2;
  border: none;
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
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        {...otherProps}
      />
      <Button
        type="button"
        onClick={() => {
          if (!inputValue) return;
          addItem(inputValue);
          setInputValue("");
        }}
      >
        <MdAdd />
      </Button>
    </Container>
  );
};

export { RepeaterInput };
