import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Checklist } from "../..";
import { IAdvert } from "../../../interfaces/IAdvert";
import Button from "../../Button";
import { Modal } from "../../Modal";
import { QrCamera } from "../../QrCamera";
import { AdvertImage } from "../Common";
import useItemDetailsModal from "../useItemDetailsModal";

const AbortButton = styled(Button)`
  color: ${(props) => props.theme.colors.monoLight};
`;

const CameraContainer = styled.div`
  border-radius: 9.5px 9.5px 0 0;
  width: 100%;
`;

const Content = styled(Modal.Content)`
  p {
    font-size: 20px;
  }

  h1 {
    margin-top: 12px;
  }

  h5 {
    color: ${(props) => props.theme.colors.darkest};
    font-size: 18px;

    &.subTitle {
      margin-bottom: 0px;
      color: ${(props) => props.theme.colors.primaryDark};
    }
  }

  i {
    color: ${(props) => props.theme.colors.dark};
    font-size: 16px;
  }
`;
interface Props {
  advert: IAdvert;
  isVisible: boolean;
  toggleModal: () => void;
  onFinish: () => void;
  image: string;
}

const ReturnModal: React.FC<Props> = ({
  advert,
  isVisible,
  toggleModal,
  onFinish,
  image,
}) => {
  const [currentStep, isQrResultValid, setQrResult, nextStep, prevStep, reset] =
    useItemDetailsModal({
      advert,
    });

  const { accessories = [] } = advert;
  const initialChecklist = accessories.map((accessory) => ({
    id: accessory,
    label: accessory,
    checked: true,
  }));
  const [checklistItems, setChecklistItems] = useState(initialChecklist);

  const handleFinish = useCallback(() => {
    onFinish();
    reset();
    toggleModal();
  }, [onFinish, reset, toggleModal]);

  const handleCancel = () => {
    reset();
    toggleModal();
  };

  useEffect(() => {
    if (isQrResultValid && accessories.length === 0) {
      handleFinish();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQrResultValid]);

  const steps = [
    <>
      <CameraContainer>
        <QrCamera setResult={setQrResult} />
      </CameraContainer>
      <Content>
        <h5 className="subTitle">Lämna tillbaka</h5>
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
      </Content>
    </>,
    <>
      {image && <AdvertImage src={image} alt={advert.title} />}
      <Content>
        <h5 className="subTitle">Lämna tillbaka</h5>
        <h1>Kontrollera så alla delar är med</h1>
        <p>
          Checka för alla tillbehör som är med. Har du glömt eller tappat bort
          något så kan du och den som delar ordna med det senare.
        </p>

        <Checklist data={checklistItems} setData={setChecklistItems}>
          <Checklist.Title>Checklista</Checklist.Title>
          {checklistItems.map((checklistItem) => (
            <Checklist.Item
              key={checklistItem.id}
              id={checklistItem.id}
              label={checklistItem.label}
              checked={checklistItem.checked}
            />
          ))}
          <i>
            Saknas något utöver det som saknades när du hämtade ut prylen kan du
            lämna tillbaka det senare. Kontakta gärna den som delar direkt om
            hur ni gör med det saknade tillbehöret.
          </i>
        </Checklist>

        <Button
          block
          size="xl"
          type="button"
          marginTop={24}
          onClick={() => {
            handleFinish();
          }}
        >
          Lämna prylen
        </Button>
      </Content>
    </>,
  ];

  return (
    <Modal isVisible={isVisible}>
      <Modal.Body>
        <Modal.CloseButton onClick={toggleModal} />
        {steps[currentStep]}
      </Modal.Body>
    </Modal>
  );
};

export default ReturnModal;
