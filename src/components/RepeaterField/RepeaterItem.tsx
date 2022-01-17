import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import { useRepeaterFieldContext } from "./RepeaterFieldContext";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 56px;
  align-items: center;
`;

const Span = styled.span`
  flex-grow: 2;
  font-size: 16px;
  padding: 0 0 0 24px;
  color: ${(props) => props.theme.colors.darker};
`;

const Button = styled.button`
  background-color: transparent;
  cursor: pointer;
  border: none;
  padding: 0 16px;
  svg {
    color: ${(props) => props.theme.colors.monoLight};
    font-size: 24px;
  }
`;

export interface RepeaterItemInterface {
  value: string;
  [x: string]: unknown;
}

const RepeaterItem: FunctionComponent<RepeaterItemInterface> = ({
  value,
  ...otherProps
}) => {
  const { removeItem } = useRepeaterFieldContext();

  return (
    <Container {...otherProps}>
      <Span>{value}</Span>
      <Button type="button" onClick={() => removeItem(value)}>
        <MdClose />
      </Button>
    </Container>
  );
};

export { RepeaterItem };
