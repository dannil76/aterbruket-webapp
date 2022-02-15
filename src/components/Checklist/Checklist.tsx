import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { ChecklistProvider } from "./ChecklistContext";
import { ChecklistItem, ItemInterface } from "./ChecklistItem";

const Body = styled.div`
  padding: 16px;
  border-radius: 9.5px;
  background-color: ${(props) => props.theme.colors.grayLighter};

  > i {
    padding-left: 8px;
    padding-right: 8px;
    color: ${(props) => props.theme.colors.dark};
    font-size: 16px;
    margin-bottom: 16px;
    margin-top: 24px;
    display: block;
  }
`;

const Title = styled.h4`
  font-size: 12px;
  color: ${(props) => props.theme.colors.dark};
  border-bottom: 2px solid ${(props) => props.theme.colors.grayLight};
  display: inline-block;
  text-transform: uppercase;
  margin-top: 8px;
  padding-bottom: 16px;
`;

interface ChecklistComposition {
  Item: FunctionComponent<ItemInterface>;
  Body: FunctionComponent;
  Title: FunctionComponent;
}

interface ChecklistProps {
  data: ItemInterface[];
  setData: (value: ItemInterface[]) => void;
}

const Checklist: React.FC<ChecklistProps> & ChecklistComposition = ({
  data,
  setData,
  children,
}) => {
  const checkItem = (id: string) => {
    const newData = data.map((item) => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });

    setData(newData);
  };

  return (
    <ChecklistProvider value={{ checkItem }}>
      <Body>{children}</Body>
    </ChecklistProvider>
  );
};

Checklist.Title = Title;
Checklist.Item = ChecklistItem;
Checklist.Body = Body;

export { Checklist };
