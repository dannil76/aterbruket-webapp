import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import { IAdvert } from "../../interfaces/IAdvert";
import Button from "../Button";
import { Modal } from "../Modal";
import { QrCamera } from "../QrCamera";
import useItemDetailsModal from "./useItemDetailsModal";

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

const PickUpModal: React.FC<Props> = ({
  advert,
  isVisible,
  toggleModal,
  onFinish,
}) => {
  const [
    currentStep,
    isQrResultValid,
    setQrResult,
    nextStep,
    prevStep,
    reset,
  ] = useItemDetailsModal({
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

  const borrowSteps = [
    <>
      <CameraContainer>
        <QrCamera setResult={setQrResult} />
      </CameraContainer>
      <Modal.Content>
        <H4>Låna</H4>
        <h1>Skanna QR-koden</h1>
        <p>
          Leta reda på QR-koden på prylen och skanna den med telefonen för att
          fortsätta
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
    </>,
    <Modal.Content>
      <H4>Låna</H4>
      <h1>{advert.title}</h1>
      <p>Kontrollera så alla tillbehör är med innan du fortsätter.</p>
      <p>Ingår i paketet</p>
      <p>
        Är allt inte med klickar du på “NEJ” och berättar vad som saknas så den
        som delar får veta att tillbehör saknades när du hämtade prylen.
      </p>

      <AbortButton
        block
        size="xl"
        color="grayLighter"
        type="button"
        marginTop={24}
        onClick={() => {
          nextStep();
        }}
      >
        Nej
      </AbortButton>

      <Button
        block
        size="xl"
        type="button"
        marginTop={24}
        onClick={() => {
          handleFinish();
        }}
      >
        Ja
      </Button>
    </Modal.Content>,

    <Modal.Content>
      <H4>Låna</H4>
      <h1>Allt var visst inte med</h1>
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
        Avbryt
      </AbortButton>
      <Button
        block
        size="xl"
        type="button"
        marginTop={24}
        onClick={handleFinish}
      >
        Registrera
      </Button>
    </Modal.Content>,
  ];

  const recycleSteps = [
    <>
      <CameraContainer>
        <QrCamera setResult={setQrResult} />
      </CameraContainer>
      <Modal.Content>
        <H4>Haffa</H4>
        <h1>Skanna QR-koden</h1>
        <p>
          Leta reda på QR-koden på prylen och skanna den med telefonen för att
          fortsätta
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
    </>,
  ];

  interface IAdvertByType {
    [key: string]: React.ReactNode[];
  }

  const stepsByType: IAdvertByType = {
    recycle: recycleSteps,
    borrow: borrowSteps,
  };

  return (
    <Modal isVisible={isVisible}>
      <Modal.Body>
        <Modal.CloseButton onClick={toggleModal} />
        {stepsByType[advert.advertType]
          ? stepsByType?.[advert.advertType]?.[currentStep]
          : null}
      </Modal.Body>
    </Modal>
  );
};

export default PickUpModal;
