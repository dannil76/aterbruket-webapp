import React, { useState, useEffect, useCallback } from 'react';
import * as Styled from '../styles/styled';
import { Checklist } from '../..';
import { Advert } from '../../../graphql/models';
import Button from '../../Button';
import { Modal } from '../../Modal';
import { QrCamera } from '../../QrCamera';
import { AdvertImage } from '../Common';
import useItemDetailsModal from '../useItemDetailsModal';
import { AdvertAccessory } from '../../../models/accessory';

interface Props {
    advert: Advert;
    isVisible: boolean;
    toggleModal: () => void;
    onFinish: (checklistItems: AdvertAccessory[] | undefined) => void;
    image: string;
}

const ReturnModal: React.FC<Props> = ({
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
    const initialChecklist = accessories?.map(
        (accessory) =>
            ({
                id: accessory,
                label: accessory,
                checked: true,
            } as AdvertAccessory),
    );
    const [checklistItems, setChecklistItems] = useState(initialChecklist);

    const handleFinish = useCallback(() => {
        onFinish(checklistItems);
        reset();
        toggleModal();
    }, [onFinish, reset, toggleModal]);

    const handleCancel = () => {
        reset();
        toggleModal();
    };

    useEffect(() => {
        if (isQrResultValid && (!accessories || accessories.length === 0)) {
            handleFinish();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isQrResultValid]);

    const steps = [
        <>
            <Styled.CameraContainer>
                <QrCamera setResult={setQrResult} />
            </Styled.CameraContainer>
            <Modal.Content>
                <Styled.Subtitle>Lämna tillbaka</Styled.Subtitle>
                <Styled.Header>Skanna QR-koden</Styled.Header>
                <Styled.Text>
                    Leta reda på QR-koden på prylen och scanna den med telefonen
                    för att fortsätta.
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
                <Styled.Subtitle>Lämna tillbaka</Styled.Subtitle>
                <Styled.Header>Kontrollera så alla delar är med</Styled.Header>
                <Styled.Text>
                    Checka för alla tillbehör som är med. Har du glömt eller
                    tappat bort något så kan du och den som delar ordna med det
                    senare.
                </Styled.Text>

                <Checklist data={checklistItems} setData={setChecklistItems}>
                    <Checklist.Title>Checklista</Checklist.Title>
                    {checklistItems.map((checklistItem) => (
                        <Checklist.Item
                            key={checklistItem.id}
                            id={checklistItem.id}
                            label={checklistItem.label ?? ''}
                            checked={checklistItem.checked}
                        />
                    ))}
                    <Styled.Link>
                        Saknas något utöver det som saknades när du hämtade ut
                        prylen kan du lämna tillbaka det senare. Kontakta gärna
                        den som delar direkt om hur ni gör med det saknade
                        tillbehöret.
                    </Styled.Link>
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
            </Modal.Content>
        </>,
    ];

    if (advert.lockerCode) {
        steps.unshift(
            <>
                <Styled.LockerModal>
                    <Styled.Content>
                        <Styled.Subtitle>Lämna tillbaka</Styled.Subtitle>
                        <Styled.Header>{advert.title}</Styled.Header>
                        <Styled.Text>{advert.returnInformation}</Styled.Text>
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
                        Okej
                    </Button>
                </Styled.LockerModal>
            </>,
        );
    }

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
