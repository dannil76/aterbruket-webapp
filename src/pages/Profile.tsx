import API, { GraphQLResult } from '@aws-amplify/api';
import { graphqlOperation } from 'aws-amplify'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import { ListAdvertisementsQuery } from '../API';
import AdvertContainer from '../components/AdvertContainer';
import { listAdvertisements } from '../graphql/queries';
import { UserContext } from "../contexts/UserContext"


export default function Profile() {
    const user: any = useContext(UserContext)
    console.log(user)
    const [adverts, setAdverts] = useState([{}]) as any;

    const InformationFrame = styled.header`
        padding: 24px;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04)), #FFFFFF;
        border-radius: 4.5px;
    `;

    const InformationHeader = styled.p`
        text-transform: uppercase;
        color: #0069B4;
    `;


    const InformationContainer = styled.div`
        width: 100vw;
        height: 100vh;
        padding:0px 8px;
        background: #FCFCFC;
    `;

    const fetchCreatedAdverts = async () => {

        const result = (await API.graphql(
            graphqlOperation(listAdvertisements, { filter: { giver: { eq: user.attributes.sub } } })
        )) as GraphQLResult<ListAdvertisementsQuery>;
        const advertItem = result.data?.listAdvertisements?.items;
        setAdverts(advertItem);
    };

    //Fetch and replace placeholder 
    useEffect(() => {
        fetchCreatedAdverts();
    }, [user])

    const userInfo = [];

    for (let key in user.attributes) {
        userInfo.push(
            <div>
                <InformationHeader>{key}</InformationHeader>
                <InformationFrame>{user[key]}</InformationFrame>
            </div>
        )
    }

    return (

        <main>
            <h1> {user.attributes.name} </h1>
            <InformationContainer>
                <h3> Kontakt </h3>
                {userInfo}
                <AdvertContainer title="Created" adverts={adverts} />
            </InformationContainer>
        </main>
    )
}
