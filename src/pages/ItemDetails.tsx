import { Storage } from 'aws-amplify';
import React, {
    FC,
    Suspense,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { MdArrowBack, MdCameraAlt, MdEdit, MdPeople } from 'react-icons/md';
import Loader from 'react-loader-spinner';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Moment } from 'moment';
import { Advert, BorrowStatus, ItemAdvertType } from '../graphql/models';
import Button from '../components/Button';
import {
    DefaultContent as BorrowContent,
    ReservationModal,
    ReturnContent,
    ReturnModal,
} from '../components/ItemDetails/Borrow';
import {
    AdvertImage,
    MainSection,
    SubTitle,
    TopSection,
    Header,
} from '../components/ItemDetails/Common';
import PickUpModal from '../components/ItemDetails/PickUpModal';
import RecycleContent from '../components/ItemDetails/Recycle/DefaultContent';
import { useModal } from '../components/Modal';
import QRCode from '../components/QRCodeContainer';
import UserContext from '../contexts/UserContext';
import { IDateRange } from '../interfaces/IDateRange';
import {
    convertToSwedishDate,
    getActiveReservation,
    getStatus,
} from '../utils/advertHelper';
import { isDateAvailable } from '../utils/calendarUtils';
import { getCategoryByKey } from '../utils/handleCategories';
import {
    reserveAdvert,
    unreserveAdvert,
    pickUpAdvert,
    addBooking,
    cancelBooking,
    changeBooking,
    borrowItem,
    returnItem,
    getItemFromApi,
    deleteItem,
} from '../api';
import { AdvertAccessory } from '../models/accessory';
import { getRecycleInventory } from '../utils';
import { localization } from '../localizations';

const CarouselComp = React.lazy(() => import('../components/CarouselComp'));
const EditItemForm = React.lazy(
    () => import('../components/Forms/EditItemForm'),
);
const RegiveItemForm = React.lazy(
    () => import('../components/Forms/RegiveItemForm'),
);

const Separator = styled.div`
    width: 100%;
    border-top: 3px dashed ${(props) => props.theme.colors.grayLighter};
`;

const BottomSection = styled.section`
    width: 100%;
    padding-bottom: 64px;
`;

const HeaderButton = styled(Button)`
    font-weight: 900;
    position: absolute;
    right: 16px;
`;

const EditButton = styled(Button)`
    border: 2px solid #6f9725;
    color: ${(props) => props.theme.colors.darkest};
    svg {
        color: #6f9725;
    }
`;

const LoaderWrapper = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ReservationSection = styled.div`
    text-align: center;
    margin-bottom: 16px;
`;

interface IComponents {
    [key: string]: {
        [key: string]: {
            [key: string]: JSX.Element | null | JSX.Element[];
        };
    };
}

interface ParamTypes {
    id: string;
}

const ItemDetails: FC<ParamTypes> = () => {
    const { id } = useParams<ParamTypes>();
    const [item, setItem] = useState(undefined as Advert | undefined);
    const [editItem, setEditItem] = useState(false);
    const [regive, setRegive] = useState(false);
    const [showCarousel, setShowCarousel] = useState(false);
    const { user } = useContext(UserContext);
    const [image, setImage] = useState('') as any;
    const [itemUpdated, setItemUpdated] = useState(false);
    const [isReserved, setIsReserved] = useState(false);
    const buttonOutOfScreen = useRef(null);
    const [refVisible, setRefVisible] = useState(false);
    const [showHeaderBtn, setShowHeaderBtn] = useState(false);
    const [isReservationModalVisible, toggleReservationModal] = useModal();
    const [isPickUpModalVisible, togglePickUpModal] = useModal();
    const [isRecycleType, setIsRecycleType] = useState(false);
    const [isBorrowType, setIsBorrowType] = useState(false);
    const [isReturnModalVisible, toggleReturnModal] = useModal();
    const [requestedQuantity, setRequestedQuantity] = useState(1);
    const [recycleInventory, setRecycleInventory] = useState(0);
    const [itemId, setItemId] = useState('');
    const [reservationDateRange, setReservationDateRange] = useState<{
        startDate: string | null;
        endDate: string | null;
        bookingType: string;
    }>({
        startDate: null,
        endDate: null,
        bookingType: '',
    });

    const itemCategory = getCategoryByKey(item?.category);

    const fetchImage = (advert: Advert) => {
        if (
            !advert.images ||
            advert.images.length === 0 ||
            !advert.images[0].src
        ) {
            return;
        }

        // Type from storage
        // eslint-disable-next-line @typescript-eslint/ban-types
        Storage.get(advert.images[0].src).then((url: Object | string) => {
            setImage(url);
        });
    };

    const fetchItem = async () => {
        const advertItem = await getItemFromApi(id);
        if (!advertItem) {
            toast.error(`Prylen kunde tyvärr inte laddas in.`);
            return;
        }

        fetchImage(advertItem);
        setItem(advertItem);
        setItemId(advertItem.id);
        setIsRecycleType(advertItem.advertType === ItemAdvertType.recycle);
        setIsBorrowType(advertItem.advertType === ItemAdvertType.borrow);
        setRecycleInventory(getRecycleInventory(advertItem));
    };

    const closeEditformAndFetchItem = async () => {
        await fetchItem();
        setEditItem(false);
        setRegive(false);
    };

    useEffect(() => {
        if (!item) {
            return;
        }

        const advert = item as Advert;
        if (!advert) {
            return;
        }

        if (advert.advertType === 'borrow') {
            const status =
                advert.advertBorrowCalendar?.calendarEvents?.some((event) => {
                    return (
                        (event.status === BorrowStatus.reserved ||
                            event.status === BorrowStatus.pickedUp) &&
                        event.borrowedBySub === user.sub
                    );
                }) ?? false;

            setIsReserved(status);
        }

        if (advert.advertType === 'recycle') {
            const status =
                advert.advertPickUps?.some((pickUp) => {
                    return (
                        !pickUp.pickedUp && pickUp.reservedBySub === user.sub
                    );
                }) ?? false;

            setIsReserved(status);
        }
    }, [item, user.sub]);

    useEffect(() => {
        fetchItem();
        setItemUpdated(false);
    }, [itemUpdated]);

    const history = useHistory();
    let handler: any;
    const scrollFunc = () => {
        handler = () => {
            const element: any = buttonOutOfScreen.current;

            const buttonPos: any = element.offsetTop - element.offsetHeight;

            if (window.scrollY >= buttonPos) {
                setShowHeaderBtn(true);
            } else {
                setShowHeaderBtn(false);
            }
        };

        window.addEventListener('scroll', handler, false);
    };
    useEffect(() => {
        if (!refVisible) {
            return;
        }

        scrollFunc();
        return () => {
            window.removeEventListener('scroll', handler, false);
        };
    });

    const callApi = async (
        call: Promise<string | undefined>,
        successText: string,
        errorText: string,
    ): Promise<void> => {
        const error = await call;
        if (error) {
            toast.warn(`${errorText} ${error}`);
            return;
        }

        setShowHeaderBtn(false);
        fetchItem();
        toast(successText);
    };

    // RECYCLE
    const onClickReserveBtn = () => {
        callApi(
            reserveAdvert(itemId, user, requestedQuantity, setItemUpdated),
            localization.successfullyReserved,
            localization.unsuccessfullyReserved,
        );
    };

    const onClickUnreserveBtn = () => {
        callApi(
            unreserveAdvert(itemId, user, setItemUpdated),
            localization.successfullyUnReserved,
            localization.unsuccessfullyUnReserved,
        );
    };

    const onClickPickUpBtn = () => {
        callApi(
            pickUpAdvert(itemId, user, setItemUpdated),
            localization.successfullyPickedUp,
            localization.unsuccessfullyPickedUp,
        );
    };

    // BORROW
    const onClickAddBookingBtn = async () => {
        callApi(
            addBooking(
                itemId,
                user,
                reservationDateRange.startDate,
                reservationDateRange.endDate,
                requestedQuantity,
            ),
            localization.successfullyBooked,
            localization.unsuccessfullyBooked,
        );
    };

    const onClickCancelBtn = async () => {
        callApi(
            cancelBooking(itemId, user),
            localization.successfullyCancelled,
            localization.unknownError,
        );
    };

    const onClickChangeBooking = async () => {
        callApi(
            changeBooking(
                itemId,
                reservationDateRange.startDate,
                reservationDateRange.endDate,
                user,
                requestedQuantity,
            ),
            localization.successfullyChanged,
            localization.unsuccessfullyChanged,
        );
    };

    const onClickBorrowBtn = async (
        missingAccessories: string[] | undefined,
    ) => {
        callApi(
            borrowItem(itemId, user, missingAccessories),
            localization.successfullyBorrowed,
            localization.unsuccessfullyBorrowed,
        );
    };

    const onClickReturnBtn = async (
        accessories: AdvertAccessory[] | undefined,
    ) => {
        callApi(
            returnItem(itemId, user, accessories),
            localization.successfullyReturned,
            localization.unknownError,
        );
    };

    const onClickDelete = async () => {
        deleteItem(itemId, () => {
            history.push('/app');
        }).then((message) => {
            if (message) {
                console.log(message);
                toast.warn(localization.unknownError);
            } else {
                toast(localization.successfullyRemovedItem);
            }
        });
    };

    const goBackFunc = () => {
        history.goBack();
    };

    const userSub = user?.sub ? user.sub : '';
    const status = getStatus(item, user, new Date());
    const activeReservation = getActiveReservation(item, userSub);

    const handleRequestedQuantity = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRequestedQuantity(Number.parseInt(event.target.value, 10));
    };

    const handleReservationDateRange = (
        changeEvent: IDateRange,
        bookingType: string,
    ) => {
        const { startDate, endDate } = changeEvent;
        setReservationDateRange({ startDate, endDate, bookingType });
    };

    const components: IComponents = {
        recycle: {
            modal: {
                available: (item && (
                    <ReservationModal
                        isVisible={isReservationModalVisible}
                        toggleModal={toggleReservationModal}
                        handleRequestedQuantity={handleRequestedQuantity}
                        availableInventory={recycleInventory ?? 1}
                        unitType={item.quantityUnit ?? 'st'}
                        onFinish={() => {
                            onClickReserveBtn();
                        }}
                    />
                )) ?? <></>,
                reserved: (item && (
                    <PickUpModal
                        advert={item}
                        isVisible={isPickUpModalVisible}
                        toggleModal={togglePickUpModal}
                        onFinish={() => {
                            onClickPickUpBtn();
                        }}
                    />
                )) ?? <></>,
                default: null,
            },
            content: {
                default: (
                    <RecycleContent
                        advert={item}
                        status={status}
                        remainingInventory={recycleInventory}
                    />
                ),
            },
            bottom: {
                default: [
                    <Separator key="1" />,
                    <QRCode
                        key="2"
                        id={id}
                        recycleId={item?.aterbruketId}
                        itemTitle={item?.title}
                    />,
                ],
            },
        },
        borrow: {
            modal: {
                available: (
                    <ReservationModal
                        isVisible={isReservationModalVisible}
                        toggleModal={toggleReservationModal}
                        handleRequestedQuantity={handleRequestedQuantity}
                        availableInventory={item?.quantity ?? 1}
                        unitType={item?.quantityUnit ?? 'st'}
                        setDateRange={handleReservationDateRange}
                        onFinish={() => {
                            onClickAddBookingBtn();
                        }}
                        availableCalendarDates={(quantity: number) => {
                            return (date: Moment) =>
                                !isDateAvailable(
                                    date,
                                    item?.advertBorrowCalendar,
                                    item?.quantity,
                                    quantity,
                                );
                        }}
                    />
                ),
                pickUpAllowed: (item && (
                    <PickUpModal
                        image={image}
                        advert={item}
                        isVisible={isPickUpModalVisible}
                        toggleModal={togglePickUpModal}
                        onFinish={(missingAccessories) => {
                            onClickBorrowBtn(missingAccessories);
                        }}
                    />
                )) ?? <></>,
                pickedUp: (item && (
                    <ReturnModal
                        image={image}
                        advert={item}
                        isVisible={isReturnModalVisible}
                        toggleModal={toggleReturnModal}
                        onFinish={(accessories) => {
                            onClickReturnBtn(accessories);
                        }}
                    />
                )) ?? <></>,
                default: null,
            },
            content: {
                default: <BorrowContent advert={item} />,
                pickedUp: <ReturnContent advert={item} />,
            },
            bottom: {
                default: [
                    <Separator />,
                    <QRCode id={id} itemTitle={item?.title} />,
                ],
            },
        },
    };

    const renderSection = (
        type: string | undefined | null,
        section: string,
        advertStatus: string,
    ): JSX.Element | null | JSX.Element[] => {
        if (!type || !section || !advertStatus) {
            return null;
        }

        if (typeof components[type][section][advertStatus] === 'undefined') {
            return components[type][section].default;
        }

        return components[type][section][advertStatus];
    };

    const handleDeleteAdvert = async (advertId: string | undefined) => {
        if (!advertId) {
            return;
        }

        if (window.confirm(localization.removePrompt)) {
            onClickDelete();
        }
    };

    const handleUnbookAdvert = async (advert: Advert | undefined) => {
        if (!advert) {
            return;
        }

        if (window.confirm(localization.unregisterPrompt)) {
            onClickCancelBtn();
        }
    };

    const allDetails = (
        <>
            {renderSection(item?.advertType, 'modal', status)}

            {(status === 'available' ||
                status === 'borrowPermissionDenied') && (
                <Header>
                    <MdArrowBack onClick={goBackFunc} />
                    <p className="headerTitle">{item?.title}</p>
                    {showHeaderBtn && isRecycleType && (
                        <HeaderButton
                            size="sm"
                            onClick={() => {
                                onClickReserveBtn();
                            }}
                            type="button"
                        >
                            HAFFA!
                        </HeaderButton>
                    )}
                    {showHeaderBtn && isBorrowType && (
                        <HeaderButton
                            size="sm"
                            onClick={() => {
                                toggleReservationModal();
                            }}
                            type="button"
                        >
                            RESERVERA
                        </HeaderButton>
                    )}
                </Header>
            )}

            {(status === BorrowStatus.reserved ||
                status === BorrowStatus.pickedUp ||
                status === 'pickUpAllowed') && (
                <Header reserved>
                    <MdArrowBack onClick={goBackFunc} />

                    <div>
                        <p className="headerTitle">{item?.title}</p>
                        {status === BorrowStatus.reserved ||
                        status === 'pickUpAllowed' ? (
                            <p className="reservedP">Reserverad</p>
                        ) : (
                            <p className="reservedP">Uthämtad</p>
                        )}
                    </div>

                    {isRecycleType && showHeaderBtn && (
                        <HeaderButton
                            size="sm"
                            color="primaryLight"
                            onClick={() => {
                                togglePickUpModal();
                            }}
                            type="button"
                        >
                            HÄMTA UT
                        </HeaderButton>
                    )}

                    {isBorrowType &&
                        showHeaderBtn &&
                        status === 'pickUpAllowed' && (
                            <HeaderButton
                                size="sm"
                                color="primaryLight"
                                onClick={() => {
                                    togglePickUpModal();
                                }}
                                type="button"
                            >
                                HÄMTA UT
                            </HeaderButton>
                        )}
                </Header>
            )}

            <TopSection>
                <AdvertImage
                    src={image}
                    alt={item?.title}
                    onClick={(e) => setShowCarousel(true)}
                />

                <div className="titleDiv">
                    {isBorrowType && (
                        <h4>
                            <MdPeople /> Delning
                        </h4>
                    )}
                    {isRecycleType && <h4>{itemCategory?.title}</h4>}

                    <h1>{item?.title}</h1>
                    <p>{item?.aterbruketId}</p>
                </div>

                {isBorrowType && status === 'borrowPermissionDenied' && (
                    <>
                        <Button
                            disabled
                            size="xl"
                            marginBottom={24}
                            marginLeft={24}
                            marginRight={24}
                            shadow
                            type="button"
                        >
                            Behörighet saknas
                        </Button>
                        <span>
                            Tyvärr, du saknar behörighet för att låna prylen.
                        </span>
                    </>
                )}

                {isRecycleType && status === 'available' && (
                    <Button
                        size="xl"
                        marginBottom={24}
                        marginLeft={24}
                        marginRight={24}
                        shadow
                        ref={(el: any) => {
                            buttonOutOfScreen.current = el;
                            setRefVisible(!!el);
                        }}
                        onClick={() => {
                            if (item?.quantity === 1) {
                                onClickReserveBtn();
                            } else {
                                toggleReservationModal();
                            }
                        }}
                        type="button"
                    >
                        HAFFA!
                    </Button>
                )}

                {isRecycleType && status === 'reserved' && isReserved && (
                    <>
                        <Button
                            size="xl"
                            marginBottom={12}
                            marginLeft={24}
                            marginRight={24}
                            color="primaryLight"
                            ref={(el: any) => {
                                buttonOutOfScreen.current = el;
                                setRefVisible(!!el);
                            }}
                            onClick={() => {
                                togglePickUpModal();
                            }}
                            type="button"
                        >
                            Hämta ut
                        </Button>
                        <Button
                            size="lg"
                            marginBottom={12}
                            marginLeft={24}
                            marginRight={24}
                            transparent
                            type="button"
                            onClick={() => {
                                onClickUnreserveBtn();
                            }}
                        >
                            Ta bort reservation
                        </Button>
                    </>
                )}

                {isBorrowType && status === BorrowStatus.available && (
                    <Button
                        shadow
                        size="xl"
                        marginBottom={24}
                        marginLeft={24}
                        marginRight={24}
                        ref={(el: any) => {
                            buttonOutOfScreen.current = el;
                            setRefVisible(!!el);
                        }}
                        onClick={toggleReservationModal}
                        type="button"
                    >
                        Jag vill låna!
                    </Button>
                )}

                {isBorrowType && status === 'pickUpAllowed' && (
                    <Button
                        shadow
                        size="xl"
                        color="primaryLight"
                        marginLeft={24}
                        marginRight={24}
                        marginBottom={24}
                        ref={(el: any) => {
                            buttonOutOfScreen.current = el;
                            setRefVisible(!!el);
                        }}
                        onClick={togglePickUpModal}
                        type="button"
                    >
                        <MdCameraAlt />
                        Hämta lånad pryl
                    </Button>
                )}

                {isBorrowType && status === BorrowStatus.pickedUp && (
                    <Button
                        shadow
                        size="xl"
                        color="primaryLight"
                        marginLeft={24}
                        marginRight={24}
                        marginBottom={24}
                        ref={(el: any) => {
                            buttonOutOfScreen.current = el;
                            setRefVisible(!!el);
                        }}
                        onClick={toggleReturnModal}
                        type="button"
                    >
                        <MdCameraAlt />
                        Lämna tillbaka
                    </Button>
                )}

                {status === BorrowStatus.pickedUp &&
                    isRecycleType &&
                    isReserved && (
                        <Button
                            size="xl"
                            marginBottom={24}
                            marginLeft={24}
                            marginRight={24}
                            onClick={() => {
                                setRegive(true);
                            }}
                            type="button"
                        >
                            Annonsera igen
                        </Button>
                    )}

                {(status === BorrowStatus.available || isBorrowType) &&
                    (item?.giver === user.sub || user.isAdmin) && (
                        <>
                            <EditButton
                                size="xl"
                                color="primaryLighter"
                                marginBottom={8}
                                marginLeft={24}
                                marginRight={24}
                                onClick={() => setEditItem(true)}
                                type="button"
                            >
                                <MdEdit />
                                Ändra
                            </EditButton>

                            <Button
                                color="darkest"
                                size="sm"
                                transparent
                                marginBottom={16}
                                onClick={() => handleDeleteAdvert(item?.id)}
                            >
                                Ta bort annons
                            </Button>

                            {item?.giver === user.sub && (
                                <span>Den här annonsen har du lagt upp.</span>
                            )}
                        </>
                    )}

                {isBorrowType &&
                    (status === BorrowStatus.reserved ||
                        status === 'pickUpAllowed') && (
                        <>
                            <ReservationSection>
                                {(status === BorrowStatus.reserved ||
                                    status === 'pickUpAllowed') && (
                                    <SubTitle>Reserverad av dig</SubTitle>
                                )}
                                <p>
                                    {convertToSwedishDate(
                                        activeReservation?.dateStart ?? '',
                                    )}{' '}
                                    -{' '}
                                    {convertToSwedishDate(
                                        activeReservation?.dateEnd ?? '',
                                    )}
                                </p>
                            </ReservationSection>
                            <Button
                                color="darkest"
                                size="sm"
                                transparent
                                marginTop={-26}
                                onClick={() => handleUnbookAdvert(item)}
                            >
                                Avboka reservationen
                            </Button>
                        </>
                    )}

                {isBorrowType && status === BorrowStatus.pickedUp && (
                    <>
                        <ReservationSection>
                            {status === 'pickedUp' && (
                                <SubTitle>Uthämtad av dig</SubTitle>
                            )}
                            <p>
                                {convertToSwedishDate(
                                    activeReservation?.dateStart ?? '',
                                )}{' '}
                                -{' '}
                                {convertToSwedishDate(
                                    activeReservation?.dateEnd ?? '',
                                )}
                            </p>
                        </ReservationSection>
                    </>
                )}
            </TopSection>

            <MainSection>
                {renderSection(item?.advertType, 'content', status)}
            </MainSection>

            <BottomSection>
                {renderSection(item?.advertType, 'bottom', status)}
            </BottomSection>
        </>
    );

    const getFormComponent = () => {
        if (editItem && item) {
            return (
                <EditItemForm
                    setEditItem={setEditItem}
                    item={item}
                    closeEditformAndFetchItem={closeEditformAndFetchItem}
                    image={image}
                />
            );
        }

        if (regive && item) {
            return (
                <RegiveItemForm
                    setRegive={setRegive}
                    item={item}
                    closeEditformAndFetchItem={closeEditformAndFetchItem}
                    image={image}
                />
            );
        }

        if (showCarousel) {
            return (
                <CarouselComp setShowCarousel={setShowCarousel} image={image} />
            );
        }

        if (item && Object.keys(item).length === 0) {
            return (
                <LoaderWrapper>
                    <Loader
                        type="Rings"
                        color="#50811b"
                        height={80}
                        width={80}
                    />
                </LoaderWrapper>
            );
        }

        return allDetails;
    };

    return (
        <main style={{ padding: 0 }}>
            <Suspense fallback={<div>Loading...</div>}>
                {getFormComponent()}
            </Suspense>
        </main>
    );
};

export default ItemDetails;
