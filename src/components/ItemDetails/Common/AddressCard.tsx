import React, { FC } from "react";
import { MdPlace } from "react-icons/md";
import Loader from "react-loader-spinner";
import styled from "styled-components";
import { IAdvert } from "../../../interfaces/IAdvert";
import { launchNavigation } from "../../../utils/advertHelper";
import Button from "../../Button";
import Map from "../../Map";
import Card from "./Card";
import SubTitle from "./SubTitle";

interface Props {
  advert: IAdvert;
}

const MapButton = styled(Button)`
  width: 100%;
  text-align: left;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.primaryLighter};
  color: ${(props) => props.theme.colors.primaryDark};
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    font-size: 24px;
    color: ${(props) => props.theme.colors.secondaryDark};
  }
`;

const AddressCard: FC<Props> = ({ advert }) => {
  return (
    <Card>
      <div className="cardHeader">
        {advert && advert.location && (
          <Map mapTypeControl={false} location={advert.location} />
        )}

        {!advert.location && (
          <Loader type="ThreeDots" color="#9db0c6" height={50} width={50} />
        )}
      </div>
      <div className="cardBody">
        <SubTitle>Adress</SubTitle>
        <p>{advert.department}</p>
        <p>{advert.location}</p>
        <MapButton
          size="lg"
          secondary
          type="button"
          onClick={() =>
            advert.location ? launchNavigation(advert.location) : null
          }
        >
          Hitta hit
          <MdPlace />
        </MapButton>
      </div>
    </Card>
  );
};

export default AddressCard;
