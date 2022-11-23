import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Moment } from 'moment';
import { Modal } from '../../Modal';
import Button from '../../Button';
import DateRangePicker from '../../DateRangePicker';
import { IDateRange } from '../../../interfaces/IDateRange';
import {
    FieldDescription,
    FieldSection,
    FormContainer,
} from '../../Forms/FormLayout/styled';
import { Label } from '../../Forms/FormLayout/FormLayout';
import Input from '../../Input';

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
    setDateRange?: (changeEvent: IDateRange, bookingType: string) => void;
    onFinish: () => void;
    availableCalendarDates?: (quantity: number) => (date: Moment) => boolean;
    availableInventory: number;
    unitType: string;
    handleRequestedQuantity: React.ChangeEventHandler<HTMLInputElement>;
}

const ReservationModal: React.FC<Props> = ({
    isVisible,
    toggleModal,
    setDateRange,
    onFinish,
    availableCalendarDates,
    availableInventory,
    unitType,
    handleRequestedQuantity,
}) => {
    const [requestedQuantity, setRequestedQuantity] = useState(1);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = Number.parseInt(event.target.value, 10);
        const onlyNumbers = new RegExp('^[0-9]*$').test(event.target.value);
        if (!onlyNumbers && event.target.value !== '') {
            // eslint-disable-next-line no-param-reassign
            event.target.value = `${requestedQuantity}`;
            return;
        }

        if (!onlyNumbers || Number.isNaN(parsed)) {
            setRequestedQuantity(1);
            return;
        }

        setRequestedQuantity(parsed);
        handleRequestedQuantity(event);
    };

    return (
        <Modal isVisible={isVisible}>
            <Modal.Body>
                <Modal.CloseButton onClick={toggleModal} />
                <ModalContent>
                    <FormContainer>
                        <form onSubmit={() => {}}>
                            {availableInventory > 1 && (
                                <FieldSection key="quantity">
                                    <Label htmlFor="quantity" required>
                                        Hur många prylar behöver du?
                                    </Label>
                                    <Input
                                        name="quantity"
                                        type="text"
                                        required
                                        title="Lagersaldo"
                                        defaultValue="1"
                                        onChange={handleChange}
                                    />
                                    <FieldDescription>
                                        {`Det finns ${availableInventory} ${unitType}.`}
                                    </FieldDescription>
                                </FieldSection>
                            )}

                            {availableCalendarDates && setDateRange && (
                                <FieldSection key="calendar">
                                    <Label htmlFor="calendar" required>
                                        När vill du låna?
                                    </Label>
                                    <DateRangePicker
                                        onValueChange={setDateRange}
                                        bookingType="reserved"
                                        blockedDay={availableCalendarDates}
                                        quantity={requestedQuantity}
                                    />
                                </FieldSection>
                            )}

                            <Button
                                block
                                size="xl"
                                type="button"
                                onClick={() => {
                                    onFinish();
                                    toggleModal();
                                }}
                            >
                                Boka
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
                        </form>
                    </FormContainer>
                </ModalContent>
            </Modal.Body>
        </Modal>
    );
};

export default ReservationModal;
