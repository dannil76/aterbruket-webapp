import React, { FC, useContext, useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import Form from './FormLayout/FormLayout';
import useForm from '../../hooks/useForm';
import { updateAdvert } from '../../graphql/mutations';
import UserContext from '../../contexts/UserContext';
import { IAdvert } from '../../interfaces/IAdvert';
import { Modal } from '../Modal';
import { AdvertImage } from '../ItemDetails/Common';
import { recycleFormFields } from './formFields';

interface Props {
    item: IAdvert;
    setRegive: React.Dispatch<React.SetStateAction<boolean>>;
    closeEditformAndFetchItem: () => void;
    image: string;
}

const RegiveItemForm: FC<Props> = ({
    setRegive,
    item,
    closeEditformAndFetchItem,
    image,
}: Props) => {
    const { user } = useContext(UserContext);

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
            status: 'available',
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
            company: user.company ? user.company : '',
            department: user.department ? user.department : '',
            address: user.address ? user.address : '',
            postalCode: user.postalCode ? user.postalCode : '',
            city: item.city,
            contactPerson: user.name ? user.name : '',
            email: user.email ? user.email : '',
            phoneNumber: item.phoneNumber ? item.phoneNumber : '',
            climateImpact: item.climateImpact,
            version: 0,
            revisions: item.revisions + 1,
            purchasePrice: item.purchasePrice ? item.purchasePrice : '',
            giver: user.sub,
            missingItemsInformation: item.missingItemsInformation ?? '',
            pickUpInformation: item.pickUpInformation ?? '',
            pickUpInstructions: item.pickUpInstructions ?? '',
            returnInformation: item.returnInformation ?? '',
            reservationDate: item.reservationDate,
            accessories: item.accessories ?? [],
            borrowDifficultyLevel: item.borrowDifficultyLevel,
            accessRestriction: item.accessRestriction,
            accessRestrictionSelection: item.accessRestrictionSelection,
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
                    <Modal.CloseButton onClick={() => setRegive(false)} />
                    <AdvertImage src={imageURL} alt={values.title} />
                    <Form
                        values={values}
                        fields={recycleFormFields(true)}
                        mutation={updateAdvert}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        handleCheckboxChange={handleCheckboxChange}
                        handleDateRangeChange={handleDateRangeChange}
                        handleSetValue={handleSetValue}
                    />
                </>
            )}
        </>
    );
};

export default RegiveItemForm;
