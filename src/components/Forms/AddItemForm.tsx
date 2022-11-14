import React, { FC, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import { Redirect } from 'react-router-dom';
import Form from './FormLayout/FormLayout';
import useForm from '../../hooks/useForm';
import { createAdvert } from '../../graphql/mutations';
import { borrowFormFields, recycleFormFields } from './formFields';
import UserContext from '../../contexts/UserContext';
import { administrations } from '../../static/advertMeta';

const ItemImg = styled.img`
    width: 200px;
    height: 200px;
    margin: 0;
`;

const AddItemForm: FC = () => {
    const { user } = useContext(UserContext);
    const company = administrations.find(
        (administration) => user.company === administration.title,
    );
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
            title: '',
            advertType: 'recycle',
            status: 'available',
            aterbruketId: '',
            category: '',
            quantity: 1,
            height: '',
            width: '',
            length: '',
            color: '',
            condition: undefined,
            areaOfUse: { indoors: false, outside: false },
            material: {
                metal: false,
                plastic: false,
                other: false,
                wood: false,
            },
            description: '',
            company: company ? company.key : '',
            department: user.department ? user.department : '',
            instructions: '',
            contactPerson: user.name ? user.name : '',
            email: user.email ? user.email : '',
            phoneNumber: '',
            giver: user.sub,
            climateImpact: 0,
            version: 0,
            revisions: 0,
            purchasePrice: '',
            missingItemsInformation: '',
            pickUpInformation: '',
            pickUpInstructions: '',
            lockerCodeInformation: '',
            lockerCode: '',
            returnInformation: '',
            reservationDate: 'N/A',
            accessories: [],
            borrowDifficultyLevel: '',
            accessRestriction: 'none',
            accessRestrictionSelection: {},
            advertBorrowCalendar: {
                allowedDateStart: null,
                allowedDateEnd: null,
                calendarEvents: [],
            },
            address: user.address ? user.address : '',
            postalCode: user.postalCode ? user.postalCode : '',
            city: 'Helsingborg',
        },
        createAdvert,
    );

    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
        if (file) {
            setImageURL(URL.createObjectURL(file));
        }
    }, [file]);

    if (redirect && !fileUploading) {
        return <Redirect to={`/item/${redirect}`} />;
    }

    return (
        <>
            {!fileUploading && file && <ItemImg src={imageURL} />}

            {fileUploading && (
                <Loader
                    type="ThreeDots"
                    color="#9db0c6"
                    height={200}
                    width={200}
                />
            )}

            {!fileUploading && (
                <Form
                    values={values}
                    fields={
                        values.advertType === 'recycle'
                            ? recycleFormFields()
                            : borrowFormFields()
                    }
                    mutation={createAdvert}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    handleDateRangeChange={handleDateRangeChange}
                    handleCheckboxChange={handleCheckboxChange}
                    handleSetValue={handleSetValue}
                />
            )}
        </>
    );
};

export default AddItemForm;
