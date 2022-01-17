import React, { FC, useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import Loader from "react-loader-spinner";
import useForm from "../hooks/useForm";
import { createAdvert } from "../graphql/mutations";
import fields from "../static/formFields";
import UserContext from "../contexts/UserContext";

const Form = React.lazy(() => import("../components/Form"));

const ItemImg = styled.img`
  width: 200px;
  height: 200px;
  margin: 0;
`;

const AddItem: FC = () => {
  const { user } = useContext(UserContext);
  const {
    values,
    handleInputChange,
    handleSubmit,
    handleCheckboxChange,
    handleSetValue,
    redirect,
    file,
    fileUploading,
  } = useForm(
    {
      title: "",
      advertType: "recycle",
      status: "available",
      aterbruketId: "",
      category: "",
      quantity: 1,
      height: "",
      width: "",
      length: "",
      color: "",
      condition: undefined,
      areaOfUse: { indoors: false, outside: false },
      material: {
        metal: false,
        plastic: false,
        other: false,
        wood: false,
      },
      description: "",
      company: user.company ? user.company : "",
      department: user.department ? user.department : "",
      location: user.address ? user.address : "",
      instructions: "",
      contactPerson: user.name ? user.name : "",
      email: user.email ? user.email : "",
      phoneNumber: "",
      giver: user.sub,
      climateImpact: 0,
      version: 0,
      revisions: 0,
      purchasePrice: "",
      missingItemsInformation: "",
      pickUpInformation: "",
      pickUpInstructions: "",
      returnInformation: "",
      accessories: [],
    },
    createAdvert
  );
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    if (file) {
      setImageURL(URL.createObjectURL(file));
    }
  }, [file]);

  if (redirect && !fileUploading) {
    return <Redirect to={`/item/${redirect}`} />;
  }

  return (
    <main style={{ marginBottom: "0px" }}>
      {!fileUploading && file && <ItemImg src={imageURL} />}

      {!fileUploading && (
        <Form
          values={values}
          fields={fields}
          mutation={createAdvert}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleCheckboxChange={handleCheckboxChange}
          handleSetValue={handleSetValue}
        />
      )}

      {fileUploading && (
        <Loader type="ThreeDots" color="#9db0c6" height={200} width={200} />
      )}
    </main>
  );
};

export default AddItem;
