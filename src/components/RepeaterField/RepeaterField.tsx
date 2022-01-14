import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import {
  RepeaterFieldProvider,
  useRepeaterFieldContext,
} from "./RepeaterFieldContext";

const Container = styled.div`
  border: 1px soid seagreen;
`;

interface RepeaterItemProps {
  value: string;
}

interface RepeaterFieldComposition {
  SubmitButton: FunctionComponent;
  Item: FunctionComponent<RepeaterItemProps>;
}

interface RepeaterFieldProps {
  addItem: (value: string) => void;
  removeItem: (value: string) => void;
}

const RepeaterField: React.FC<RepeaterFieldProps> & RepeaterFieldComposition =
  ({ addItem, removeItem, children }) => {
    const [inputValue, setInputValue] = useState<string>("");

    return (
      <RepeaterFieldProvider
        value={{ inputValue, setInputValue, addItem, removeItem }}
      >
        <Container>{children}</Container>
      </RepeaterFieldProvider>
    );
  };

const SubmitButton: FunctionComponent = ({ children }) => {
  const { inputValue, setInputValue, addItem } = useRepeaterFieldContext();
  return (
    <>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        type="button"
        onClick={() => {
          addItem(inputValue);
          setInputValue("");
        }}
      >
        {children}
      </button>
    </>
  );
};

const RepeaterItem: FunctionComponent<RepeaterItemProps> = ({
  value,
  children,
}) => {
  const { removeItem } = useRepeaterFieldContext();

  return (
    <div>
      {children}
      <span>
        {value}
        <button type="button" onClick={() => removeItem(value)}>
          X
        </button>
      </span>
    </div>
  );
};

RepeaterField.SubmitButton = SubmitButton;
RepeaterField.Item = RepeaterItem;

export { RepeaterField };
