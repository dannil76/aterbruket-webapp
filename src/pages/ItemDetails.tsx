import { graphqlOperation, GraphQLResult } from "@aws-amplify/api";
import { API, Storage } from "aws-amplify";
import React, {
  FC,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MdArrowBack, MdCameraAlt, MdEdit, MdPeople } from "react-icons/md";
import Loader from "react-loader-spinner";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { GetAdvertQuery } from "../API";
import Button from "../components/Button";
import {
  DefaultContent as BorrowContent,
  ReservationModal,
  ReturnContent,
  ReturnModal,
} from "../components/ItemDetails/Borrow";
import {
  MainSection,
  SubTitle,
  TopSection,
} from "../components/ItemDetails/Common";
import PickUpModal from "../components/ItemDetails/PickUpModal";
import RecycleContent from "../components/ItemDetails/Recycle/DefaultContent";
import { useModal } from "../components/Modal";
import QRCode from "../components/QRCodeContainer";
import UserContext from "../contexts/UserContext";
import { createAdvert, updateAdvert } from "../graphql/mutations";
import { getAdvert } from "../graphql/queries";
import { ICalendarUpdateResult, IDateRange } from "../interfaces/IDateRange";
import {
  convertToSwedishDate,
  getActiveReservation,
  getStatus,
} from "../utils/advertHelper";
import {
  addDateRangeToEvents,
  isDateAvailable,
  updateAdvertCalendar,
  updateEventStatus,
} from "../utils/calendarUtils";
import { getCategoryByKey } from "../utils/handleCategories";

const CarouselComp = React.lazy(() => import("../components/CarouselComp"));
const EditItemForm = React.lazy(() => import("../components/EditItemForm"));
const RegiveForm = React.lazy(() => import("../components/RegiveForm"));

const ImgDiv = styled.div`
  width: 100%;
  height: 256px;
  display: flex;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.offWhite};
  margin-top: 60px;

  img {
    max-height: 256px;
    width: 100vw;
    margin: 0;
    object-fit: cover;
  }
`;

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
  const [image, setImage] = useState("") as any;
  const [itemUpdated, setItemUpdated] = useState(false);
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
      graphqlOperation(getAdvert, { id, version: 0 })
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

    window.addEventListener("scroll", handler, false);
  };
  useEffect(() => {
    if (!refVisible) {
      return;
    }

    scrollFunc();
    return () => {
      window.removeEventListener("scroll", handler, false);
    };
  });

  const updateItem = async (newStatus: string) => {
    const result = (await API.graphql(
      graphqlOperation(updateAdvert, {
        input: {
          id,
          status: newStatus,
          reservedBySub: user.sub,
          reservedByName: user.name,
          version: 0,
          revisions: item.revisions + 1,
        },
      })
    )) as any;

    setItemUpdated(true);

    delete item.createdAt;
    delete item.updatedAt;
    item.version = result.data.updateAdvert.revisions + 1;

    await API.graphql(graphqlOperation(createAdvert, { input: item }));
  };

  const onClickReservBtn = () => {
    updateItem("reserved");
    setShowHeaderBtn(false);
  };

  const onClickRemoveResBtn = () => {
    updateItem("available");
    setShowHeaderBtn(false);
  };

  const onClickPickUpBtn = () => {
    updateItem("pickedUp");
    setShowHeaderBtn(false);
  };

  const history = useHistory();

  const goBackFunc = () => {
    history.goBack();
  };

  const isRecycleType = item.advertType === "recycle";
  const isBorrowType = item.advertType === "borrow";

  const [reservationDateRange, setReservationDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
    bookingType: string;
  }>({
    startDate: null,
    endDate: null,
    bookingType: "",
  });

  const userSub = user?.sub ? user.sub : "";
  const status = getStatus(item, user, new Date());
  const activeReservation = getActiveReservation(item, userSub);

  const handleReservationDateRange = (
    changeEvent: IDateRange,
    bookingType: string
  ) => {
    const { startDate, endDate } = changeEvent;
    setReservationDateRange({ startDate, endDate, bookingType });
  };

  const handleSaveReservation = async (): Promise<ICalendarUpdateResult> => {
    const newCalendarEvent = {
      dateRange: {
        startDate: reservationDateRange.startDate,
        endDate: reservationDateRange.endDate,
      },
      eventType: reservationDateRange.bookingType,
    };

    const addEventResult = addDateRangeToEvents(
      item.advertBorrowCalendar,
      newCalendarEvent,
      userSub
    );

    if (addEventResult.updateSuccessful) {
      await updateAdvertCalendar(item, addEventResult.updatedCalendarResult);
    }
    await fetchItem();

    return addEventResult;
  };

  const handleSaveReservationStatus = async (
    newStatus: string
  ): Promise<boolean> => {
    const updatedEvent = updateEventStatus(
      item.advertBorrowCalendar,
      activeReservation,
      newStatus
    );

    if (updatedEvent.updateSuccessful) {
      await updateAdvertCalendar(item, updatedEvent.updatedCalendarResult);
    }
    await fetchItem();

    return updatedEvent.updateSuccessful;
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
              toast("Snyggt! Prylen är nu haffad!");
            }}
          />
        ),
        default: null,
      },
      content: {
        default: <RecycleContent advert={item} status={status} />,
      },
      bottom: {
        default: [<Separator key="1" />, <QRCode key="2" id={id} />],
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
              handleSaveReservation().then((saveReservationResult) => {
                return saveReservationResult.updateSuccessful
                  ? toast("Prylen är nu bokad!")
                  : toast.error(
                      `Prylen kunde tyvärr inte bokas. ${
                        saveReservationResult.errorMessage || ""
                      }`
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
            advert={item}
            isVisible={isPickUpModalVisible}
            toggleModal={togglePickUpModal}
            onFinish={() => {
              handleSaveReservationStatus("pickedUp").then((statusSaved) => {
                return statusSaved
                  ? toast("Snyggt! Prylen är nu lånad och i ditt ansvar!")
                  : toast.error("Prylen kunde tyvärr inte lånas.");
              });
            }}
          />
        ),
        pickedUp: (
          <ReturnModal
            advert={item}
            isVisible={isReturnModalVisible}
            toggleModal={toggleReturnModal}
            onFinish={() => {
              handleSaveReservationStatus("returned").then((statusSaved) => {
                return statusSaved
                  ? toast("Snyggt! Prylen är nu återlämnad!")
                  : toast.error("Prylen kunde tyvärr inte lämnas tillbaka.");
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
        default: [<Separator />, <QRCode id={id} />],
      },
    },
  };

  const renderSection = (
    type: string,
    section: string,
    advertStatus: string
  ): JSX.Element | null | JSX.Element[] => {
    if (!type || !section || !advertStatus) {
      return null;
    }

    if (typeof components[type][section][advertStatus] === "undefined") {
      return components[type][section].default;
    }

    return components[type][section][advertStatus];
  };

  const allDetails = (
    <>
      {renderSection(item.advertType, "modal", status)}

      <TopSection>
        {(status === "available" || status === "borrowPermissionDenied") && (
          <header className="header">
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
          </header>
        )}

        {(status === "reserved" ||
          status === "pickedUp" ||
          status === "pickUpAllowed") && (
            <header className="reservedHeader">
              <MdArrowBack onClick={goBackFunc} />

              <div>
                <p className="headerTitle headerTitle--reserved">{item.title}</p>
                {status === "reserved" || status === "pickUpAllowed" ? (
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

              {isBorrowType && showHeaderBtn && status === "pickUpAllowed" && (
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
            </header>
          )}

        <ImgDiv>
          {image && (
            <img src={image} alt="" onClick={() => setShowCarousel(true)} />
          )}
        </ImgDiv>

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

        {isBorrowType && status === "borrowPermissionDenied" && (
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
            <span>Tyvärr, du saknar behörighet för att låna prylen.</span>
          </>
        )}

        {isRecycleType && status === "available" && (
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

        {isRecycleType &&
          status === "reserved" &&
          item.reservedBySub === user.sub && (
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
                  onClickRemoveResBtn();
                }}
              >
                Ta bort reservation
              </Button>
            </>
          )}

        {isBorrowType && status === "available" && (
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

        {isBorrowType && status === "pickUpAllowed" && (
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

        {isBorrowType && status === "pickedUp" && (
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

        {status === "pickedUp" &&
          isRecycleType &&
          item.reservedBySub === user.sub && (
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

        {(status === "available" || isBorrowType) &&
          (item.giver === user.sub || user.isAdmin) && (
            <>
              <EditButton
                size="xl"
                color="primaryLighter"
                marginBottom={24}
                marginLeft={24}
                marginRight={24}
                onClick={() => setEditItem(true)}
                type="button"
              >
                <MdEdit />
                Ändra
              </EditButton>
              {item.giver === user.sub && (
                <span>Den här annonsen har du lagt upp.</span>
              )}
            </>
          )}

        {isBorrowType &&
          (status === "reserved" ||
            status === "pickUpAllowed" ||
            status === "pickedUp") && (
            <ReservationSection>
              {(status === "reserved" || status === "pickUpAllowed") && (
                <SubTitle>Reserverad av dig</SubTitle>
              )}
              {status === "pickedUp" && <SubTitle>Uthämtad av dig</SubTitle>}
              <p>
                {convertToSwedishDate(activeReservation?.dateStart ?? "")} -{" "}
                {convertToSwedishDate(activeReservation?.dateEnd ?? "")}
              </p>
            </ReservationSection>
          )}
      </TopSection>

      <MainSection>
        {renderSection(item.advertType, "content", status)}
      </MainSection>

      <BottomSection>
        {renderSection(item.advertType, "bottom", status)}
      </BottomSection>
    </>
  );

  return (
    <main style={{ padding: 0 }}>
      <Suspense fallback={<div>Loading...</div>}>
        {editItem ? (
          <EditItemForm
            setEditItem={setEditItem}
            item={item}
            closeEditformAndFetchItem={closeEditformAndFetchItem}
            image={image}
          />
        ) : regive ? (
          <RegiveForm
            setRegive={setRegive}
            item={item}
            closeEditformAndFetchItem={closeEditformAndFetchItem}
          />
        ) : showCarousel ? (
          <CarouselComp setShowCarousel={setShowCarousel} image={image} />
        ) : item && Object.keys(item).length === 0 ? (
          <LoaderWrapper>
            <Loader type="Rings" color="#50811b" height={80} width={80} />
          </LoaderWrapper>
        ) : (
          allDetails
        )}
      </Suspense>
    </main>
  );
};

export default ItemDetails;
