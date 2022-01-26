import React, { FunctionComponent, MouseEvent } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { MdClose } from "react-icons/md";

const ModalDiv = styled.div`
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.64);
`;

const Content = styled.div`
  position: absolute;
  bottom: 0;

  border-radius: 9.5px 9.5px 0 0;
  background-color: ${(props) => props.theme.colors.white};
  margin: auto;
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 20px);
  padding: 20px;
`;

const Button = styled.button`
  width: 32px;
  height: 32px;
  background: ${(props) => props.theme.colors.primaryDark};
  border-radius: 50%;
  position: absolute;
  border: none;
  top: 24px;
  right: 24px;

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${(props) => props.theme.colors.white};
    font-size: 24px;
  }
`;

interface CloseButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

interface ModalComposition {
  Content: FunctionComponent;
  CloseButton: FunctionComponent<CloseButtonProps>;
}

type Props = {
  isVisible: boolean;
};

const Modal: FunctionComponent<Props> & ModalComposition = ({
  isVisible,
  children,
}) => {
  if (!isVisible) return null;

  return createPortal(<ModalDiv>{children}</ModalDiv>, document.body);
};

const CloseButton: FunctionComponent<CloseButtonProps> = ({ onClick }) => (
  <Button onClick={onClick}>
    <MdClose />
  </Button>
);

Modal.Content = Content;
Modal.CloseButton = CloseButton;

export default Modal;
