import React from 'react';
import styled from 'styled-components';
import { Moment } from 'moment';
import { Modal } from '../../Modal';
import Button from '../../Button';
import DateRangePicker from '../../DateRangePicker';
import { IDateRange } from '../../../interfaces/IDateRange';

const ModalContent = styled(Modal.Content)`
    margin-top: 72px;
    text-align: center;

    .DateRangePicker {
        margin-bottom: 56px;
    }
`;

interface Props {
    isVisible: boolean;
    toggleModal: () => void;
    setDateRange: (changeEvent: IDateRange, bookingType: string) => void;
    onFinish: () => void;
    availableCalendarDates: (quantity: number) => (date: Moment) => boolean;
    quantity: number;
}

const ReservationModal: React.FC<Props> = ({
    isVisible,
    toggleModal,
    setDateRange,
    onFinish,
    availableCalendarDates,
    quantity,
}) => {
    return (
        <Modal isVisible={isVisible}>
            <Modal.Body>
                <Modal.CloseButton onClick={toggleModal} />
                <ModalContent>
                    <h4>När vill du låna prylen?</h4>

                    <DateRangePicker
                        onValueChange={setDateRange}
                        bookingType="reserved"
                        blockedDay={availableCalendarDates}
                        quantity={quantity}
                    />

                    <Button
                        block
                        size="xl"
                        type="button"
                        onClick={() => {
                            onFinish();
                            toggleModal();
                        }}
                    >
                        Boka låning
                    </Button>
                    <Button
                        transparent
                        block
                        size="xl"
                        type="button"
                        onClick={toggleModal}
                    >
                        Avbryt
                    </Button>
                </ModalContent>
            </Modal.Body>
        </Modal>
    );
};

export default ReservationModal;
