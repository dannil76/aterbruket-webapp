/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/button-has-type */
import React, { FC, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";

import styled from "styled-components";
import { graphqlOperation, GraphQLResult } from "@aws-amplify/api";
import { API } from "aws-amplify";
import QRCode from "../components/QRCodeContainer";
import { GetAdvertisementQuery } from "../API";
import { getAdvertisement } from "../graphql/queries";
import { updateAdvertisement } from "../graphql/mutations";
import EditItemForm from "../components/EditItemForm";
import { loadMapApi } from "../utils/GoogleMapsUtils";
import Map from "../components/Map";
import CarouselComp from "../components/CarouselComp";

const ItemImg = styled.img`
  width: 300px;
  height: 300px;
  margin: 0;
`;

const Table = styled.table`
  width: 90%;
  max-width: 500px;
  margin: 10px auto;
  border-collapse: collapse;

  td {
    text-align: left;
    padding: 10px;
    border: none;
    font-weight: 500;
  }

  td:nth-child(2) {
    width: 70%;
    border: none;
    font-weight: 400;
  }
`;

const MapContainer = styled.div`
  width: 80%;
  height: 45vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

interface ParamTypes {
  id: string;
}

const ItemDetails: FC<ParamTypes> = () => {
  const { id } = useParams<ParamTypes>();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [item, setItem] = useState({}) as any;
  const [reservedClicked, setReservedClicked] = useState(false);
  const [editItem, setEditItem] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);

  const fetchItem = async () => {
    const result = (await API.graphql(
      graphqlOperation(getAdvertisement, { id })
    )) as GraphQLResult<GetAdvertisementQuery>;
    const advertItem = result.data?.getAdvertisement;
    setItem(advertItem);
  };

  const closeEditformAndFetchItem = async () => {
    await fetchItem();
    setEditItem(false);
  };

  useEffect(() => {
    fetchItem();
  }, []);

  useEffect(() => {
    const googleMapScript = loadMapApi();

    const cb = () => {
      setScriptLoaded(true);
    };
    googleMapScript.addEventListener("load", cb);

    return () => {
      googleMapScript.removeEventListener("load", cb);
    };
  }, []);
  const updateItem = async () => {
    const result: any = await API.graphql(
      graphqlOperation(updateAdvertisement, {
        input: {
          id,
          status: "reserved",
        },
      })
    );

    const advertItem = result.data?.updateAdvertisement;
    setItem(advertItem);
  };

  const onClickReservBtn = () => {
    updateItem();
    setReservedClicked(true);
  };

  const history = useHistory();
  const allDetails = (
    <>
      <button onClick={() => setEditItem(true)}>Edit</button>
      <button
        onClick={() => {
          onClickReservBtn();
        }}
      >
        HAFFA
      </button>
      <button onClick={() => history.goBack()}>Tillbaka</button>
      {reservedClicked && (
        <p>
          Du har haffat {item.title} statusen är: {item.status}
        </p>
      )}
      <h1>{item.title}</h1>
      <ItemImg
        src="https://storage.googleapis.com/web-pro-nilo-kavehome/media/cache/c4/10/c410118add2b5cb169d71a0c20596f50.jpg"
        alt=""
        onClick={() => setShowCarousel(true)}
      />
      <Table>
        <tbody>
          <tr>
            <td>Category:</td>
            <td>Table</td>
          </tr>
          <tr>
            <td>Id:</td>
            <td>{id}</td>
          </tr>
          <tr>
            <td>Height(cm):</td>
            <td>200</td>
          </tr>
          <tr>
            <td>Width (cm):</td>
            <td>{item.width}</td>
          </tr>
          <tr>
            <td>Depth (cm):</td>
            <td>50</td>
          </tr>
          <tr>
            <td>Color:</td>
            <td>Grey</td>
          </tr>

          <tr>
            <td>Material:</td>
            <td>Wood</td>
          </tr>
          <tr>
            <td>Item Condition:</td>
            <td>Good</td>
          </tr>
          <tr>
            <td>Areas of Usage:</td>
            <td>Indoor office</td>
          </tr>
          <tr>
            <td>LCA Value:</td>
            <td>50</td>
          </tr>
          <tr>
            <td>Description:</td>
            <td>{item.description}</td>
          </tr>
          <tr>
            <td>Location:</td>
            <td>{item.location}</td>
          </tr>
        </tbody>
      </Table>

      <MapContainer>
        {item && item.location && (
          <Map
            mapType={google.maps.MapTypeId.ROADMAP}
            mapTypeControl={false}
            location={item.location}
          />
        )}

        {!item.location && (
          <Loader type="ThreeDots" color="#9db0c6" height={50} width={50} />
        )}
      </MapContainer>
      <div>
        <QRCode id={id} />
      </div>
    </>
  );

  return (
    <main>
      {editItem ? (
        <EditItemForm
          setEditItem={setEditItem}
          item={item}
          closeEditformAndFetchItem={closeEditformAndFetchItem}
        />
      ) : showCarousel ? (
        <CarouselComp setShowCarousel={setShowCarousel} />
      ) : (
        allDetails
      )}
    </main>
  );
};

export default ItemDetails;
