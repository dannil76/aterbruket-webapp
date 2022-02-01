/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import styled from "styled-components";

export interface IButton extends React.HTMLAttributes<HTMLButtonElement> {
  transparent?: boolean;
  secondary?: boolean;
  shadow?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  marginBottom?: number;
  marginTop?: number;
  marginRight?: number;
  marginLeft?: number;
  block?: boolean;
  [key: string]: any;
}

const ButtonComponent = styled.button<IButton>`
  background: ${(props) =>
    props.color ? props.theme.colors[props.color] : props.theme.colors.primary};
  border-radius: 4.5px;
  border: none;
  color: white;
  font-size: 14px;
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: ${(props) =>
    props.marginBottom ? `${props.marginBottom}px` : "0"};
  margin-right: ${(props) =>
    props.marginRight ? `${props.marginRight}px` : "0"};
  margin-left: ${(props) => (props.marginLeft ? `${props.marginLeft}px` : "0")};
  margin-top: ${(props) => (props.marginTop ? `${props.marginTop}px` : "0")};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 24px;
    margin-right: 16px;
  }

  ${({ block }) =>
    block &&
    `
      width: 100%;
  `}
  ${({ size }) =>
    size === "sm" &&
    `
      font-size: 12px;
      padding: 8px 12px;
  `}
  ${({ size }) =>
    size === "lg" &&
    `
    font-size: 16px;
    padding: 16px 32px;
  `}
  ${({ size }) =>
    size === "xl" &&
    `
    font-size: 18px;
    padding: 16px 32px;
  `}
  ${({ secondary, theme }) =>
    secondary &&
    `
      color: #205400;
      background: ${theme.colors.primaryLighter};
      font-weight: 700;
  `}
 ${({ transparent }) =>
    transparent &&
    `
      color: #565656;
      background: transparent;
      box-shadow: none;
  `}
  ${({ shadow }) =>
    shadow &&
    `
      box-shadow: 0px 0px 2px rgba(98, 98, 98, 0.18), 0px 3px 2px rgba(98, 98, 98, 0.12), 0px 6px 8px rgba(98, 98, 98, 0.12), 0px 10px 16px rgba(98, 98, 98, 0.12), 0px 26px 32px rgba(98, 98, 98, 0.12);
  `}
`;

const Button = React.forwardRef<HTMLButtonElement, IButton>((props, ref) => {
  return (
    <ButtonComponent
      ref={ref}
      size={props.size}
      secondary={props.secondary}
      transparent={props.transparent}
      shadow={props.shadow}
      {...props}
    >
      {props.children}
    </ButtonComponent>
  );
});

export default Button;
