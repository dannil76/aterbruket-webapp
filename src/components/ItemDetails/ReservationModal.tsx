import React from "react";
import styled from "styled-components";
import { Modal } from "../Modal";
import Button from "../Button";
import { IAdvert } from "../../interfaces/IAdvert";
import DateRangePicker from "../DateRangePicker";
import { IDateRange } from "../../interfaces/IDateRange";

const ModalContent = styled(Modal.Content)`
  margin-top: 72px;
  text-align: center;

  .DateRangePicker {
    margin-bottom: 56px;
  }
`;

interface Props {
  advert: IAdvert;
  isVisible: boolean;
  toggleModal: () => void;
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  setDateRange: (changeEvent: IDateRange, bookingType: string) => void;
  onFinish: () => void;
}

const ReservationModal: React.FC<Props> = ({
  advert,
  isVisible,
  toggleModal,
  dateRange,
  setDateRange,
  onFinish,
}) => {
  return (
    <Modal isVisible={isVisible}>
      <Modal.Body>
        <Modal.CloseButton onClick={toggleModal} />
        <ModalContent>
          <h4>När vill du låna prylen?</h4>

          <DateRangePicker
            numberOfMonths={1}
            onValueChange={setDateRange}
            bookingType="reserved"
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
