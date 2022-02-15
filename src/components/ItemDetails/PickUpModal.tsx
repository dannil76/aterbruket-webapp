import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { IAdvert } from "../../interfaces/IAdvert";
import Button from "../Button";
import { Modal } from "../Modal";
import { QrCamera } from "../QrCamera";
import { AdvertImage } from "./Common";
import useItemDetailsModal from "./useItemDetailsModal";
import { Checklist } from "..";

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

const AccessoriesContainer = styled.div`
  margin-bottom: 24px;

  h5 {
    margin-bottom: 0px;
    margin-top: 16px;
    color: ${(props) => props.theme.colors.primary};
  }
`;

const ButtonContainer = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: space-between;

  ${AbortButton} {
    margin-right: 16px;
  }
`;

interface Props {
  image?: string;
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

  const handleMissingAccessories = () => {
    const missingAccessories = checklistItems.filter((item) => !item.checked);
    const missingAccessoriesString = missingAccessories
      .map((item) => item.label)
      .join(", ");
    console.log(`missing accessories: ${missingAccessoriesString}`);

    handleFinish();
  };

  useEffect(() => {
    if (advert.advertType === "recycle" && isQrResultValid) {
      handleFinish();
    }

    if (
      advert.advertType === "borrow" &&
      isQrResultValid &&
      advert.accessories &&
      advert.accessories.length === 0
    ) {
      handleFinish();
    }
  }, [isQrResultValid, handleFinish, advert]);

  const borrowSteps = [
    <>
      <CameraContainer>
        <QrCamera setResult={setQrResult} />
      </CameraContainer>
      <Content>
        <h5 className="subTitle">Låna</h5>
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
      </Content>
    </>,
    <>
      {image && <AdvertImage src={image} alt={advert.title} />}
      <Content>
        <h5 className="subTitle">Låna</h5>
        <h1>{advert.title}</h1>
        <p>Kontrollera så alla tillbehör är med innan du fortsätter.</p>
        <h5>Ingår i paketet</h5>

        <AccessoriesContainer>
          {advert.accessories &&
            advert.accessories.length > 0 &&
            advert.accessories.map((accessory) => (
              <h5 className="accessory">{accessory}</h5>
            ))}
        </AccessoriesContainer>

        <i>
          Är allt inte med klickar du på “NEJ” och berättar vad som saknas så
          den som delar får veta att tillbehör saknades när du hämtade prylen.
        </i>

        <ButtonContainer>
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
        </ButtonContainer>
      </Content>
    </>,
    <>
      {image && <AdvertImage src={image} alt={advert.title} />}
      <Content>
        <h5 className="subTitle">Låna</h5>
        <h1>Allt var visst inte med</h1>
        <p>
          Trist! men det är ok. Klicka bort den eller de grejer som saknas så
          utlånaren får veta.
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
            Du kan låna ändå och behöver inte oroa dig om det saknade
            tillbehöret.
          </i>
        </Checklist>

        <ButtonContainer>
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
            onClick={handleMissingAccessories}
          >
            Registrera
          </Button>
        </ButtonContainer>
      </Content>
    </>,
  ];

  const recycleSteps = [
    <>
      <CameraContainer>
        <QrCamera setResult={setQrResult} />
      </CameraContainer>
      <Modal.Content>
        <h5 className="subTitle">Haffa</h5>
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
