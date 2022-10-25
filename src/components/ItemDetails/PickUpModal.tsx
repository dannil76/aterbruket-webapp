import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../Modal';
import { QrCamera } from '../QrCamera';
import { AdvertImage } from './Common';
import useItemDetailsModal from './useItemDetailsModal';
import { Checklist } from '..';
import Button from '../Button';
import * as Styled from './styles/styled';
import { Advert } from '../../graphql/models';

interface Props {
    image?: string;
    advert: Advert;
    isVisible: boolean;
    toggleModal: () => void;
    onFinish: (missingAccessories: string[] | undefined) => void;
}

const PickUpModal: React.FC<Props> = ({
    advert,
    isVisible,
    toggleModal,
    onFinish,
    image,
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

    const { accessories = [] } = advert;
    const initialChecklist =
        accessories?.map((accessory) => ({
            id: accessory,
            label: accessory,
            checked: true,
        })) ?? [];
    const [checklistItems, setChecklistItems] = useState(initialChecklist);

    const handleFinish = useCallback(
        (missingAccessories?: string[]) => {
            onFinish(missingAccessories);
            reset();
            toggleModal();
        },
        [onFinish, reset, toggleModal],
    );

    const handleCancel = () => {
        reset();
        toggleModal();
    };

    const handleMissingAccessories = () => {
        const missingAccessories = checklistItems.filter(
            (item) => !item.checked,
        );
        const missingAccessoriesLabels = missingAccessories
            .map((item) => item.label ?? '')
            .filter((item) => !!item);

        handleFinish(missingAccessoriesLabels);
    };

    useEffect(() => {
        if (advert.advertType === 'recycle' && isQrResultValid) {
            handleFinish();
        }

        if (
            advert.advertType === 'borrow' &&
            isQrResultValid &&
            advert.accessories &&
            advert.accessories.length === 0
        ) {
            handleFinish();
        }
    }, [isQrResultValid, handleFinish, advert]);

    const borrowSteps = [
        <>
            <Styled.CameraContainer>
                <QrCamera setResult={setQrResult} />
            </Styled.CameraContainer>
            <Modal.Content>
                <Styled.Subtitle>Låna</Styled.Subtitle>
                <Styled.Header>Skanna QR-koden</Styled.Header>
                <Styled.Text>
                    Leta reda på QR-koden på prylen och skanna den med telefonen
                    för att fortsätta
                </Styled.Text>
                <Styled.AbortButton
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
                </Styled.AbortButton>
            </Modal.Content>
        </>,
        <>
            {image && <AdvertImage src={image} alt={advert.title} />}
            <Modal.Content>
                <Styled.Subtitle>Låna</Styled.Subtitle>
                <Styled.Header>{advert.title}</Styled.Header>
                <Styled.Text>
                    Kontrollera så alla tillbehör är med innan du fortsätter.
                </Styled.Text>
                <Styled.H5>Ingår i paketet</Styled.H5>

                <Styled.AccessoriesContainer>
                    {advert.accessories &&
                        advert.accessories.length > 0 &&
                        advert.accessories.map((accessory) => (
                            <Styled.H5 className="accessory">
                                {accessory}
                            </Styled.H5>
                        ))}
                </Styled.AccessoriesContainer>

                <Styled.Link>
                    Är allt inte med klickar du på “NEJ” och berättar vad som
                    saknas så den som delar får veta att tillbehör saknades när
                    du hämtade prylen.
                </Styled.Link>

                <Styled.ButtonContainer>
                    <Styled.AbortButton
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
                    </Styled.AbortButton>

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
                </Styled.ButtonContainer>
            </Modal.Content>
        </>,
        <>
            {image && <AdvertImage src={image} alt={advert.title} />}
            <Modal.Content>
                <Styled.Subtitle>Låna</Styled.Subtitle>
                <Styled.Header>Allt var visst inte med</Styled.Header>
                <Styled.Text>
                    Trist! men det är ok. Klicka bort den eller de grejer som
                    saknas så utlånaren får veta.
                </Styled.Text>

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
                    <Styled.Link>
                        Du kan låna ändå och behöver inte oroa dig om det
                        saknade tillbehöret.
                    </Styled.Link>
                </Checklist>

                <Styled.ButtonContainer>
                    <Styled.AbortButton
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
                    </Styled.AbortButton>
                    <Button
                        block
                        size="xl"
                        type="button"
                        marginTop={24}
                        onClick={handleMissingAccessories}
                    >
                        Registrera
                    </Button>
                </Styled.ButtonContainer>
            </Modal.Content>
        </>,
    ];

    const recycleSteps = [
        <>
            <Styled.CameraContainer>
                <QrCamera setResult={setQrResult} />
            </Styled.CameraContainer>
            <Modal.Content>
                <Styled.Subtitle>Haffa</Styled.Subtitle>
                <Styled.Header>Skanna QR-koden</Styled.Header>
                <Styled.Text>
                    Leta reda på QR-koden på prylen och skanna den med telefonen
                    för att fortsätta
                </Styled.Text>
                <Styled.AbortButton
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
                </Styled.AbortButton>
            </Modal.Content>
        </>,
    ];

    if (advert.lockerCode) {
        borrowSteps.unshift(
            <>
                <Styled.LockerModal>
                    <Styled.Content>
                        <Styled.Subtitle>Låna</Styled.Subtitle>
                        <Styled.Header>{advert.title}</Styled.Header>
                        {advert.lockerCodeInformation && (
                            <Styled.Text>
                                {advert.lockerCodeInformation}
                            </Styled.Text>
                        )}
                        <Styled.LockerInstructions>
                            <h3>Kod till skåp</h3>
                            <Styled.Code>{advert.lockerCode}</Styled.Code>
                        </Styled.LockerInstructions>
                    </Styled.Content>
                    <Button
                        block
                        size="xl"
                        type="button"
                        marginTop={24}
                        onClick={() => {
                            nextStep();
                        }}
                    >
                        Okej, skåp är öppet
                    </Button>
                </Styled.LockerModal>
            </>,
        );
    }

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
