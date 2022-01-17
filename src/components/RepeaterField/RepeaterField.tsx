import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { RepeaterFieldProvider } from "./RepeaterFieldContext";
import { RepeaterItem, RepeaterItemInterface } from "./RepeaterItem";
import { RepeaterInput, RepeaterInputInterface } from "./RepeaterInput";

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4.5px;
  background-color: ${(props) => props.theme.colors.grayLighter};
`;

const Container = styled.div`
  > * {
    :nth-child(2) {
      margin-top: 8px;
    }
  }
`;

interface RepeaterFieldComposition {
  Input: FunctionComponent<RepeaterInputInterface>;
  Item: FunctionComponent<RepeaterItemInterface>;
  ItemsContainer: FunctionComponent;
}

interface RepeaterFieldProps {
  setData: (value: string[]) => void;
  data: string[];
}

const RepeaterField: React.FC<RepeaterFieldProps> & RepeaterFieldComposition =
  ({ data, setData, children }) => {
    const [inputValue, setInputValue] = useState<string>("");

    const addItem = () => {
      if (!inputValue) return;
      setData([...data, inputValue]);
      setInputValue("");
    };

    const removeItem = (value: string) => {
      setData(data.filter((item) => item !== value));
    };

    return (
      <RepeaterFieldProvider
        value={{ inputValue, setInputValue, addItem, removeItem }}
      >
        <Container>{children}</Container>
      </RepeaterFieldProvider>
    );
  };

RepeaterField.Input = RepeaterInput;
RepeaterField.Item = RepeaterItem;
RepeaterField.ItemsContainer = ItemsContainer;

export { RepeaterField };
