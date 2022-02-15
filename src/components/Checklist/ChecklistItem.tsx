import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { useChecklistContext } from "./ChecklistContext";

interface StyleInterface {
  checked: boolean;
}

const ItemContainer = styled.div<StyleInterface>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  border-radius: 4.5px;
  background-color: ${(props) => props.theme.colors.offWhite};
  margin-bottom: 8px;
  margin-top: 8px;

  ${(props) =>
    props.checked &&
    `
      background-color: ${props.theme.colors.white};
  `}
`;

const Label = styled.label<StyleInterface>`
  color: ${(props) => props.theme.colors.darker};
  font-weight: ${(props) => (props.checked ? `900` : `500`)};
`;

export interface ItemInterface {
  id: string;
  label: string;
  checked: boolean;
}

const ChecklistItem: FunctionComponent<ItemInterface> = ({
  id,
  label,
  checked,
}) => {
  const { checkItem } = useChecklistContext();
  return (
    <ItemContainer key={id} checked={checked} onClick={() => checkItem(id)}>
      <Label checked={checked} htmlFor={id}>
        {label}
      </Label>
      <input
        type="checkbox"
        name={id}
        checked={checked}
        onChange={() => checkItem(id)}
      />
    </ItemContainer>
  );
};

export { ChecklistItem };
