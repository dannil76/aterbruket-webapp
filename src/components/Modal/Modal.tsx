import React, { FunctionComponent, MouseEvent } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import { MdClose } from "react-icons/md";

const slideIn = keyframes`
  from {bottom: -300px; opacity: 0}
  to {bottom: 0; opacity: 1}
`;

const fadeIn = keyframes`
  from {opacity: 0}
  to {opacity: 1}
`;

const ModalDiv = styled.div`
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.64);
  -webkit-animation-name: ${fadeIn};
  -webkit-animation-duration: 0.4s;
  animation-name: ${fadeIn};
  animation-duration: 0.4s
`;

const Content = styled.div`
  padding: 0 32px 32px 32px;
`;

const Body = styled.div<BodyProps>`
  overflow: auto;
  position: fixed;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.white};
  width: 100%;
  -webkit-animation-name:  ${slideIn};
  -webkit-animation-duration: 0.4s;
  animation-name:  ${slideIn};
  animation-duration: 0.4s;
  border-radius: 9.5px 9.5px 0 0;
  height: calc(100% - 20px);
  height: ${(props) => props.autoHeight ? `auto` : `calc(100% - 20px)`};
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
  z-index: 1001;

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

interface BodyProps {
  autoHeight?: boolean;
}
interface ModalComposition {
  Body: FunctionComponent<BodyProps>;
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

Modal.Body = Body;
Modal.Content = Content;
Modal.CloseButton = CloseButton;

export default Modal;
