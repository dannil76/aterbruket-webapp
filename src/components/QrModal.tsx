import React, { FC } from "react";
import { Modal } from "../components/Modal";
import { QrCamera, useQrCamera } from "../components/QrCamera";
import styled from "styled-components";

interface Props {
  isVisible: boolean;
  toggleModal: () => void;
  setResult: (result: string) => void;
}

const CameraContainer = styled.div`
  border-radius: 9.5px 9.5px 0 0;
  width: 100%;
`;

const QrModal: FC<Props> = ({ isVisible, toggleModal, setResult, children }) => {

  return (
    <Modal isVisible={isVisible}>
      <Modal.Body>
        <Modal.CloseButton onClick={toggleModal} />
        <CameraContainer>
          <QrCamera setResult={setResult} />
          <Modal.Content>
            {children}
          </Modal.Content>
        </CameraContainer>
      </Modal.Body>
    </Modal>
  )
}

export default QrModal;
