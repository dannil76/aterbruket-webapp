import React, { FC, useContext } from "react";
import { FiAtSign } from "react-icons/fi";
import { MdPerson, MdPhone } from "react-icons/md";
import { IAdvert } from "../../../interfaces/IAdvert";
import Card from "./Card";
import SubTitle from "./SubTitle";
import UserContext from "../../../contexts/UserContext";

interface Props {
  advert: IAdvert;
}

const ContactCard: FC<Props> = ({ advert }) => {
  const { user } = useContext(UserContext);

  const mailtoHref = `mailto:${advert.email}?subject=En kollega vill Haffa "${advert.title}"&body=Hej ${advert.contactPerson}!%0d%0aDin kollega ${user.name} vill Haffa "${advert.title}" och har en fundering:`;
  const telHref = `tel:${advert.phoneNumber}`;

  return (
    <Card>
      <div className="cardBody">
        <div className="contactPersonDiv">
          <div className="circle">
            <MdPerson />
          </div>
          <div>
            <h4 className="dark">{advert.contactPerson}</h4>
            <SubTitle className="company">{advert.company}</SubTitle>
          </div>
        </div>
        {advert.phoneNumber && (
          <div className="contactInfo">
            <MdPhone />
            <a href={telHref}>{advert.phoneNumber}</a>
          </div>
        )}

        <div className="contactInfo">
          <FiAtSign />
          <a href={mailtoHref}>{advert.email}</a>
        </div>
      </div>
    </Card>
  );
};

export default ContactCard;
