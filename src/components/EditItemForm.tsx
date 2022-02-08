import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "react-loader-spinner";
import Form from "./Form";
import useForm from "../hooks/useForm";
import { updateAdvert } from "../graphql/mutations";
import fields from "../static/formFields";
import { IAdvert } from "../interfaces/IAdvert";

const ItemImg = styled.img`
  width: 300px;
  height: 300px;
  margin: 0;
`;

interface Props {
  item: IAdvert;
  setEditItem: React.Dispatch<React.SetStateAction<boolean>>;
  closeEditformAndFetchItem: () => void;
  image: string;
}

const EditItemForm: FC<Props> = ({
  setEditItem,
  item,
  closeEditformAndFetchItem,
  image,
}: Props) => {
  const {
    values,
    handleInputChange,
    handleSubmit,
    handleCheckboxChange,
    handleDateRangeChange,
    handleSetValue,
    redirect,
    file,
    fileUploading,
  } = useForm(
    {
      id: item.id,
      title: item.title,
      advertType: item.advertType,
      aterbruketId: item.aterbruketId ? item.aterbruketId : "",
      status: item.status,
      category: item.category,
      quantity: item.quantity,
      height: item.height,
      width: item.width,
      length: item.length,
      color: item.color,
      material: {
        metal: item?.material?.[0]?.metal,
        plastic: item?.material?.[0]?.plastic,
        other: item?.material?.[0]?.other,
        wood: item?.material?.[0]?.wood,
      },
      condition: item.condition,
      areaOfUse: {
        indoors: item?.areaOfUse?.[0]?.indoors,
        outside: item?.areaOfUse?.[0]?.outside,
      },
      description: item.description,
      company: item.company,

      department: item.department,
      address: item.address,
      postalCode: item.postalCode,
      city: item.city,
      contactPerson: item.contactPerson,
      email: item.email,
      phoneNumber: item.phoneNumber,
      climateImpact: item.climateImpact,
      version: 0,
      revisions: item.revisions + 1,
      purchasePrice: item.purchasePrice,
      missingItemsInformation: item.missingItemsInformation ?? "",
      pickUpInformation: item.pickUpInformation ?? "",
      pickUpInstructions: item.pickUpInstructions ?? "",
      returnInformation: item.returnInformation ?? "",
      accessories: item.accessories ?? [],
      borrowDifficultyLevel: item.borrowDifficultyLevel,
      accessRestriction: item.accessRestriction,
      accessRestrictionSelection: item.accessRestrictionSelection,
    },
    updateAdvert
  );

  const [imageURL, setImageURL] = useState(image);

  useEffect(() => {
    if (file) {
      setImageURL(URL.createObjectURL(file));
    }
  }, [file]);

  if (redirect && !fileUploading) {
    closeEditformAndFetchItem();
  }
  return (
    <>
      {fileUploading && (
        <Loader type="ThreeDots" color="#9db0c6" height={200} width={200} />
      )}

      {!fileUploading && (
        <>
          <button type="button" onClick={() => setEditItem(false)}>
            X
          </button>
          <ItemImg src={imageURL} />
          <Form
            values={values}
            fields={fields}
            mutation={updateAdvert}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDateRangeChange={handleDateRangeChange}
            handleCheckboxChange={handleCheckboxChange}
            handleSetValue={handleSetValue}
          />
        </>
      )}
    </>
  );
};

export default EditItemForm;
