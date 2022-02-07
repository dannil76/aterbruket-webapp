import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import { IAdvert } from "../../../interfaces/IAdvert";
import Button from "../../Button";
import { Modal } from "../../Modal";
import { QrCamera } from "../../QrCamera";
import useItemDetailsModal from "../useItemDetailsModal";

const AbortButton = styled(Button)`
  color: ${(props) => props.theme.colors.monoLight};
`;

const H4 = styled.h4`
  color: ${(props) => props.theme.colors.primaryDark};
`;

const CameraContainer = styled.div`
  border-radius: 9.5px 9.5px 0 0;
  width: 100%;
`;

interface Props {
  advert: IAdvert;
  isVisible: boolean;
  toggleModal: () => void;
  onFinish: () => void;
}

const ReturnModal: React.FC<Props> = ({
  advert,
  isVisible,
  toggleModal,
  onFinish,
}) => {
  const [currentStep, isQrResultValid, setQrResult, nextStep, prevStep, reset] =
    useItemDetailsModal({
      advert,
    });

  const handleFinish = useCallback(() => {
    onFinish();
    reset();
    toggleModal();
  }, [onFinish, reset, toggleModal]);

  const handleCancel = () => {
    reset();
    toggleModal();
  };

  // TODO: temporary fix, remove this to enable navigating to next step
  useEffect(() => {
    if (isQrResultValid) {
      handleFinish();
    }
  }, [isQrResultValid, handleFinish, advert]);

  return (
    <Modal isVisible={isVisible}>
      <Modal.Body>
        <Modal.CloseButton onClick={toggleModal} />
        <CameraContainer>
          <QrCamera setResult={setQrResult} />
        </CameraContainer>
        <Modal.Content>
          <H4>Lämna tillbaka</H4>
          <h1>Skanna QR-koden</h1>
          <p>
            Leta reda på QR-koden på prylen och scanna den med telefonen för att
            fortsätta.
          </p>
          <AbortButton
            block
            size="xl"
            color="grayLighter"
            type="button"
            marginTop={24}
            onClick={() => {
              handleCancel();
            }}
          >
            Avsluta
          </AbortButton>
        </Modal.Content>
      </Modal.Body>
    </Modal>
  );
};

export default ReturnModal;
