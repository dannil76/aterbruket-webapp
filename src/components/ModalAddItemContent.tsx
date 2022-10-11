import React, { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MdClose, MdAdd } from "react-icons/md";
import { ImQrcode } from "react-icons/im";
import { enableBodyScroll } from "body-scroll-lock";

const ModalHeader = styled.div`
  width: 100%;
  height: 61px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  border-radius: 9.5px 9.5px 0 0;
  background-color: ${(props) => props.theme.colors.offWhite};
  box-shadow: 0px 1px 0px rgba(86, 86, 86, 0.16);

  .closeBtn {
    height: 20px;
    width: 20px;
    font-size: 20px;
    line-height: 20px;
    position: absolute;
    top: 30%;
    right: 5%;
    outline: 0;
    border: none;
    background-color: transparent;
  }
`;

const ModalBody = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.grayLighter};
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 32px;

  .link {
    width: 160px;
    height: 48px;
    display: inline-block;
    border-radius: 4.5px;
    margin: 0 8px;
    text-decoration: none;
  }

  .selectBtn {
    width: 160px;
    height: 48px;
    border-radius: 4.5px;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    border: none;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;

    .btnIcon {
      display: inline-block;
      margin-right: 5px;
    }
  }
  .scanBtn {
    color: ${(props) => props.theme.colors.primaryDark};
    background-color: ${(props) => props.theme.colors.primaryLighter};
  }
  .addBtn {
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => props.theme.colors.primary};
  }
`;

type Props = {
  toggleModal: () => void;
  toggleQrModal: () => void;
};

const ModalAddItemContent: FC<Props> = ({ toggleModal, toggleQrModal }: Props) => (
  <>
    <ModalHeader>
      <button
        className="closeBtn"
        type="button"
        onClick={() => toggleModal()}
      >
        <MdClose />
      </button>
      <p>Skapa en ny annons</p>
    </ModalHeader>
    <ModalBody>

      <button
        className="selectBtn scanBtn"
        type="button"
        onClick={() => {
          toggleModal();
          toggleQrModal();
          enableBodyScroll(document.body);
        }}
      >
        <ImQrcode className="btnIcon" />
        Skanna QR
      </button>

      <Link className="link" to="/add" >
        <button
          className="selectBtn addBtn"
          type="button"
          onClick={() => {
            toggleModal();
            enableBodyScroll(document.body);
          }}
        >
          <MdAdd className="btnIcon" />
          Skapa Ny
        </button>
      </Link>
    </ModalBody>
  </>
);

export default ModalAddItemContent;
