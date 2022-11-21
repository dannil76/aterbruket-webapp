import { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { API, Storage } from 'aws-amplify';
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
import { Advert, BorrowStatus, GetAdvertQuery } from '../graphql/models';
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
import { deleteAdvert } from '../graphql/mutations';
import { getAdvert } from '../graphql/queries';
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
} from '../api';
import { AdvertAccessory } from '../models/accessory';

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
    const [item, setItem] = useState({}) as any;
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
    const [isReturnModalVisible, toggleReturnModal] = useModal();

    const itemCategory = getCategoryByKey(item?.category);

    const fetchImage = (advert: any) => {
        Storage.get(advert.images[0].src).then((url: any) => {
            setImage(url);
            setItem(advert);
        });
    };

    const fetchItem = async () => {
        const result = (await API.graphql(
            graphqlOperation(getAdvert, { id, version: 0 }),
        )) as GraphQLResult<GetAdvertQuery>;
        const advertItem: any = result.data?.getAdvert;

        fetchImage(advertItem);
        setItem(advertItem);
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

    const isRecycleType = item.advertType === 'recycle';
    const isBorrowType = item.advertType === 'borrow';

    const [reservationDateRange, setReservationDateRange] = useState<{
        startDate: string | null;
        endDate: string | null;
        bookingType: string;
    }>({
        startDate: null,
        endDate: null,
        bookingType: '',
    });

    const callApi = async (
        call: Promise<string | undefined>,
    ): Promise<string | undefined> => {
        const error = await call;
        if (!error) {
            setShowHeaderBtn(false);
            fetchItem();
        }

        return error;
    };

    // RECYCLE
    const onClickReservBtn = async () => {
        return callApi(reserveAdvert(item, user, 1, setItemUpdated));
    };

    const onClickUnreserveBtn = () => {
        return callApi(unreserveAdvert(item, user, setItemUpdated));
    };

    const onClickPickUpBtn = () => {
        return callApi(pickUpAdvert(item, user, setItemUpdated));
    };

    // BORROW
    const onClickAddBookingBtn = async () => {
        return callApi(
            addBooking(
                item,
                user,
                reservationDateRange.startDate,
                reservationDateRange.endDate,
                1,
            ),
        );
    };

    const onClickCancelBtn = async () => {
        return callApi(cancelBooking(item, user));
    };

    const onClickChangeBooking = async () => {
        return callApi(
            changeBooking(
                item,
                reservationDateRange.startDate,
                reservationDateRange.endDate,
                user,
                1,
            ),
        );
    };

    const onClickBorrowBtn = async (
        missingAccessories: string[] | undefined,
    ) => {
        return callApi(borrowItem(item, user, missingAccessories));
    };

    const onClickReturnBtn = async (
        accessories: AdvertAccessory[] | undefined,
    ) => {
        return callApi(returnItem(item, user, accessories));
    };

    const history = useHistory();

    const goBackFunc = () => {
        history.goBack();
    };

    const userSub = user?.sub ? user.sub : '';
    const status = getStatus(item, user, new Date());
    const activeReservation = getActiveReservation(item, userSub);

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
                reserved: (
                    <PickUpModal
                        advert={item}
                        isVisible={isPickUpModalVisible}
                        toggleModal={togglePickUpModal}
                        onFinish={() => {
                            onClickPickUpBtn();
                            toast('Snyggt! Prylen är nu haffad!');
                        }}
                    />
                ),
                default: null,
            },
            content: {
                default: <RecycleContent advert={item} status={status} />,
            },
            bottom: {
                default: [
                    <Separator key="1" />,
                    <QRCode
                        key="2"
                        id={id}
                        recycleId={item.aterbruketId}
                        itemTitle={item.title}
                    />,
                ],
            },
        },
        borrow: {
            modal: {
                available: (
                    <ReservationModal
                        advert={item}
                        isVisible={isReservationModalVisible}
                        toggleModal={toggleReservationModal}
                        dateRange={reservationDateRange}
                        setDateRange={handleReservationDateRange}
                        onFinish={() => {
                            onClickAddBookingBtn().then((error) => {
                                return !error
                                    ? toast('Prylen är nu bokad!')
                                    : toast.error(
                                          `Prylen kunde tyvärr inte bokas. ${error}`,
                                      );
                            });
                        }}
                        availableCalendarDates={(date) =>
                            !isDateAvailable(date, item.advertBorrowCalendar)
                        }
                    />
                ),
                pickUpAllowed: (
                    <PickUpModal
                        image={image}
                        advert={item}
                        isVisible={isPickUpModalVisible}
                        toggleModal={togglePickUpModal}
                        onFinish={(missingAccessories) => {
                            onClickBorrowBtn(missingAccessories).then(
                                (error) => {
                                    return !error
                                        ? toast(
                                              'Snyggt! Prylen är nu lånad och i ditt ansvar!',
                                          )
                                        : toast.error(
                                              `Prylen kunde tyvärr inte lånas. ${error}`,
                                          );
                                },
                            );
                        }}
                    />
                ),
                pickedUp: (
                    <ReturnModal
                        image={image}
                        advert={item}
                        isVisible={isReturnModalVisible}
                        toggleModal={toggleReturnModal}
                        onFinish={(accessories) => {
                            onClickReturnBtn(accessories).then((error) => {
                                return !error
                                    ? toast('Snyggt! Prylen är nu återlämnad!')
                                    : toast.error(
                                          `Prylen kunde tyvärr inte lämnas tillbaka. ${error}`,
                                      );
                            });
                        }}
                    />
                ),
                default: null,
            },
            content: {
                default: <BorrowContent advert={item} />,
                pickedUp: <ReturnContent advert={item} />,
            },
            bottom: {
                default: [
                    <Separator />,
                    <QRCode id={id} itemTitle={item.title} />,
                ],
            },
        },
    };

    const renderSection = (
        type: string,
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

    const handleDeleteAdvert = async (advertId: string) => {
        if (window.confirm('Är du säker på att du vill ta bort annonsen?')) {
            try {
                await API.graphql({
                    query: deleteAdvert,
                    variables: { input: { id: advertId, version: 0 } },
                });
                history.push('/app');
                toast.success('Annonsen är nu borttagen!');
            } catch (error) {
                console.error(error);
                toast.warn('Ett okänt fel inträffade 😵 Försök igen!');
            }
        }
    };

    const allDetails = (
        <>
            {renderSection(item.advertType, 'modal', status)}

            {(status === 'available' ||
                status === 'borrowPermissionDenied') && (
                <Header>
                    <MdArrowBack onClick={goBackFunc} />
                    <p className="headerTitle">{item.title}</p>
                    {showHeaderBtn && isRecycleType && (
                        <HeaderButton
                            size="sm"
                            onClick={() => {
                                onClickReservBtn();
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

            {(status === 'reserved' ||
                status === 'pickedUp' ||
                status === 'pickUpAllowed') && (
                <Header reserved>
                    <MdArrowBack onClick={goBackFunc} />

                    <div>
                        <p className="headerTitle">{item.title}</p>
                        {status === 'reserved' || status === 'pickUpAllowed' ? (
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
                    alt={item.title}
                    onClick={(e) => setShowCarousel(true)}
                />

                <div className="titleDiv">
                    {isBorrowType && (
                        <h4>
                            <MdPeople /> Delning
                        </h4>
                    )}
                    {isRecycleType && <h4>{itemCategory?.title}</h4>}

                    <h1>{item.title}</h1>
                    <p>{item.aterbruketId}</p>
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
                            onClickReservBtn();
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

                {isBorrowType && status === 'available' && (
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

                {isBorrowType && status === 'pickedUp' && (
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

                {status === 'pickedUp' && isRecycleType && isReserved && (
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

                {(status === 'available' || isBorrowType) &&
                    (item.giver === user.sub || user.isAdmin) && (
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
                                onClick={() => handleDeleteAdvert(item.id)}
                            >
                                Ta bort annons
                            </Button>

                            {item.giver === user.sub && (
                                <span>Den här annonsen har du lagt upp.</span>
                            )}
                        </>
                    )}

                {isBorrowType &&
                    (status === 'reserved' ||
                        status === 'pickUpAllowed' ||
                        status === 'pickedUp') && (
                        <ReservationSection>
                            {(status === 'reserved' ||
                                status === 'pickUpAllowed') && (
                                <SubTitle>Reserverad av dig</SubTitle>
                            )}
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
                    )}
            </TopSection>

            <MainSection>
                {renderSection(item.advertType, 'content', status)}
            </MainSection>

            <BottomSection>
                {renderSection(item.advertType, 'bottom', status)}
            </BottomSection>
        </>
    );

    const getFormComponent = () => {
        if (editItem) {
            return (
                <EditItemForm
                    setEditItem={setEditItem}
                    item={item}
                    closeEditformAndFetchItem={closeEditformAndFetchItem}
                    image={image}
                />
            );
        }

        if (regive) {
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
