import React, { FC, useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';
import Form from './FormLayout/FormLayout';
import useForm from '../../hooks/useForm';
import { updateAdvert } from '../../graphql/mutations';
import { Modal } from '../Modal';
import { AdvertImage } from '../ItemDetails/Common';
import { Advert } from '../../graphql/models';
import { borrowFormFields, recycleFormFields } from './formFields';

interface Props {
    item: Advert;
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
            aterbruketId: item.aterbruketId ? item.aterbruketId : '',
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
            revisions: item.revisions ? item.revisions + 1 : 0,
            purchasePrice: item.purchasePrice,
            missingItemsInformation: item.missingItemsInformation ?? '',
            pickUpInformation: item.pickUpInformation ?? '',
            pickUpInstructions: item.pickUpInstructions ?? '',
            lockerCodeInformation: item.lockerCodeInformation ?? '',
            lockerCode: item.lockerCode ?? '',
            returnInformation: item.returnInformation ?? '',
            reservationDate: item.reservationDate,
            accessories: item.accessories ?? [],
            borrowDifficultyLevel: item.borrowDifficultyLevel,
            accessRestriction: item.accessRestriction,
            accessRestrictionSelection: item.accessRestrictionSelection,
            advertBorrowCalendar: item?.advertBorrowCalendar,
        },
        updateAdvert,
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
                <Loader
                    type="ThreeDots"
                    color="#9db0c6"
                    height={200}
                    width={200}
                />
            )}

            {!fileUploading && (
                <>
                    <Modal.CloseButton onClick={() => setEditItem(false)} />
                    <AdvertImage src={imageURL} alt={values.title} />
                    <Form
                        values={values}
                        fields={
                            item.advertType === 'recycle'
                                ? recycleFormFields(true)
                                : borrowFormFields(true)
                        }
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
