/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable-next-line react-hooks/exhaustive-deps */

import React, {
  FC,
  useState,
  useEffect,
  useContext,
  useRef,
  Suspense,
} from "react";
import { useParams, useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import styled from "styled-components";
import { graphqlOperation, GraphQLResult } from "@aws-amplify/api";
import { API, Storage } from "aws-amplify";
import {
  MdArrowBack,
  MdEdit,
  MdPlace,
  MdPerson,
  MdPhone,
  MdPeople,
  MdCameraAlt,
} from "react-icons/md";
import { FiAtSign } from "react-icons/fi";
import { toast } from "react-toastify";
import QRCode from "../components/QRCodeContainer";
import { GetAdvertQuery } from "../API";
import { getAdvert } from "../graphql/queries";
import { createAdvert, updateAdvert } from "../graphql/mutations";
import Map from "../components/Map";
import UserContext from "../contexts/UserContext";
import showDays from "../hooks/showDays";
import { getCategoryByKey } from "../utils/handleCategories";
import { conditions, materials, areaOfUse } from "../static/advertMeta";
import { IOption } from "../interfaces/IForm";
import { useModal } from "../components/Modal";
import Button from "../components/Button";
import { ICalendarUpdateResult, IDateRange } from "../interfaces/IDateRange";
import {
  getStatus,
  getActiveReservation,
  convertToSwedishDate,
  launchNavigation,
} from "../utils/advertHelper";
import PickUpModal from "../components/ItemDetails/PickUpModal";
import ReservationModal from "../components/ItemDetails/ReservationModal";
import {
  addDateRangeToEvents,
  isDateAvailable,
  updateAdvertCalendar,
  updateEventStatus,
} from "../utils/calendarUtils";

const CarouselComp = React.lazy(() => import("../components/CarouselComp"));
const EditItemForm = React.lazy(() => import("../components/EditItemForm"));
const RegiveForm = React.lazy(() => import("../components/RegiveForm"));

const TopSection = styled.div`
  background-color: ${(props) => props.theme.colors.offWhite};
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  box-shadow: 0px 1px 0px rgba(86, 86, 86, 0.16);
  width: 100%;

  header {
    position: relative;
    width: 100%;
    height: 60px;
    position: fixed;
    background-color: ${(props) => props.theme.colors.offWhite};
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 1px 0px rgba(86, 86, 86, 0.16);

    svg {
      position: absolute;
      left: 28px;
      font-size: 24px;
      color: ${(props) => props.theme.colors.darkest};
    }
    p,
    .headerTitle {
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 132%;
      color: ${(props) => props.theme.colors.darkest};
      text-align: center;
    }
  }

  .reservedHeader {
    background-color: ${(props) => props.theme.colors.primaryLighter};

    .headerTitle--reserved {
      margin: 0;
    }

    .reservedP {
      color: ${(props) => props.theme.colors.primaryDark};
      font-size: 14px;
      margin: 0;
    }
  }

  span {
    margin-left: 24px;
    font-style: italic;
    font-weight: 500;
    font-size: 16px;
    color: ${(props) => props.theme.colors.dark};
    padding-bottom: 24px;
  }

  .titleDiv {
    width: 100%;
    h4 {
      margin: 48px 32px 12px 32px;
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 112%;
      letter-spacing: 0.0025em;
      color: ${(props) => props.theme.colors.primaryDark};

      svg {
        vertical-align: middle;
        color: ${(props) => props.theme.colors.primaryLight};
        font-size: 24px;
      }
    }
    h1 {
      font-style: normal;
      font-weight: 900;
      font-size: 36px;
      line-height: 124%;
      margin: 8px 32px 12px 32px;
    }
    p {
      margin: 8px 32px 24px 32px;
      color: ${(props) => props.theme.colors.primaryDark};
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
    }
  }
`;

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

const Line = styled.div`
   {
    width: 100%;
    border-top: 3px dashed ${(props) => props.theme.colors.grayLighter};
  }
`;

const MainSection = styled.section`
  width: 100%;
  margin: 0 auto;

  h4 {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 144%;
    margin: 0;

    color: ${(props) => props.theme.colors.primary};
  }
  .dark {
    margin: 24px 0 16px 24px;
    color: ${(props) => props.theme.colors.darkest};
    align-self: flex-start;
  }
  .description {
    box-sizing: border-box;
    margin: 0 24px;
  }

  p {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: ${(props) => props.theme.colors.darkest};
  }

  table {
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;

    td {
      padding-left: 24px;
      padding-bottom: 16px;
      border: none;
    }

    td:nth-child(2) {
      padding-right: 24px;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      text-align: right;
      word-wrap: break-word;

      span {
        color: ${(props) => props.theme.colors.dark};
      }
    }
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 16px;
  width: calc(100% - 32px);
  box-sizing: border-box;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 9.5px;
  box-shadow: 0px 0px 2px rgba(98, 98, 98, 0.18),
    0px 1px 2px rgba(98, 98, 98, 0.18);

  .cardHeader {
    z-index: 0;
    width: 100%;
    height: 200px;
    border-radius: 9.5px 9.5px 0px 0px;
  }

  .cardBody {
    padding: 24px;
  }

  p {
    font-size: 18px;
    margin: 0 0 12px 0;
  }

  .contactPersonDiv {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    h4 {
      margin: 0 16px;
      align-self: unset;
    }
    .company {
      margin: 0 16px;
    }
    .circle {
      padding: 0;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #f2f6ee;
      position: relative;
    }
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${(props) => props.theme.colors.illustration};
      font-size: 24px;
    }
  }
  .contactInfo {
    box-sizing: border-box;
    padding: 0 8px 0 8px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;
    background-color: #f5f5f5;
    border-radius: 4.5px;
    margin: 0 0 10px 0;
    line-break: anywhere;

    &:last-child {
      margin: 0;
    }

    a {
      color: ${(props) => props.theme.colors.darker};
      margin-left: 8px;
      text-decoration: inherit;
      color: inherit;
      :visited {
        text-decoration: inherit;
        color: inherit;
      }
    }
    svg {
      font-size: 20px;
      color: ${(props) => props.theme.colors.dark};
    }
  }
`;

const SubTitle = styled.h5`
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 12px 0;
  font-weight: 900;
  font-size: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.primary};

  span {
    display: inline-block;
    margin-right: 13px;
    vertical-align: middle;
  }
`;

const Section = styled.section`
  padding-bottom: 28px;
`;

const BottomSection = styled.section`
  width: 100%;
  padding-bottom: 64px;
`;

const DifficultyIcon = styled.span<{ level: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: gray;

  ${(props) => {
    switch (props.level) {
      case "medium":
        return `background-color: #EFBB1F;`;
      case "hard":
        return `background-color: #E14751;`;
      case "easy":
      default:
        return `background-color:#84C035;`;
    }
  }}
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

const MapButton = styled(Button)`
  width: 100%;
  text-align: left;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.primaryLighter};
  color: ${(props) => props.theme.colors.primaryDark};
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    font-size: 24px;
    color: ${(props) => props.theme.colors.secondaryDark};
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

interface ParamTypes {
  id: string;
}

interface MetaValues {
  metal: boolean;
  other: boolean;
  plastic: boolean;
  wood: boolean;
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

  const getMetaValues = (itemValues: MetaValues, allValues: IOption[]) => {
    const values = Object.entries(itemValues)
      .filter(([key, value]) => value)
      .map(([key, value]) => {
        const valueObj = allValues.find((v) => v.key === key);
        return valueObj?.title ? valueObj.title : "";
      });
    return values;
  };

  const itemCategory = getCategoryByKey(item?.category);
  const itemCondition = conditions.find(
    (condition) => condition.key === item?.condition
  );
  const itemMaterialsArray =
    getMetaValues(item?.material?.[0] ?? {}, materials) ?? [];
  const itemMaterialsString = itemMaterialsArray.join(", ");
  const itemAreaOfUseArray =
    getMetaValues(item?.areaOfUse?.[0] ?? {}, areaOfUse) ?? [];
  const itemAreaOfUseString = itemAreaOfUseArray.join(", ");

  const fetchImage = (item: any) => {
    Storage.get(item.images[0].src).then((url: any) => {
      setImage(url);
      setItem(item);
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
    handler = function () {
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

  const mailtoHref = `mailto:${item.email}?subject=En kollega vill Haffa "${item.title}"&body=Hej ${item.contactPerson}!%0d%0aDin kollega ${user.name} vill Haffa "${item.title}" och har en fundering:`;
  const telHref = `tel:${item.phoneNumber}`;

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
  const status = getStatus(item, userSub, new Date());
  const activeReservation = getActiveReservation(item, userSub);

  const handleReservationDateRange = (
    changeEvent: IDateRange,
    bookingType: string
  ) => {
    const { startDate, endDate } = changeEvent;
    setReservationDateRange({ startDate, endDate, bookingType });
  };

  const handleSaveReservation = async (): Promise<boolean> => {
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

    return addEventResult.updateSuccessful;
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

  const allDetails = (
    <>
      {status === "available" && (
        <ReservationModal
          advert={item}
          isVisible={isReservationModalVisible}
          toggleModal={toggleReservationModal}
          dateRange={reservationDateRange}
          setDateRange={handleReservationDateRange}
          onFinish={() => {
            handleSaveReservation().then((saveSuccessful) => {
              return saveSuccessful
                ? toast("Prylen är nu bokad!")
                : toast.error("Prylen kunde tyvärr inte bokas");
            });
          }}
          availableCalendarDates={(date) =>
            !isDateAvailable(date, item.advertBorrowCalendar)
          }
        />
      )}

      {isBorrowType && status === "pickUpAllowed" && (
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
      )}

      {isRecycleType &&
        status === "reserved" &&
        item.reservedBySub === user.sub && (
          <PickUpModal
            advert={item}
            isVisible={isPickUpModalVisible}
            toggleModal={togglePickUpModal}
            onFinish={() => {
              onClickPickUpBtn();
              toast("Snyggt! Prylen är nu haffad!");
            }}
          />
        )}

      <TopSection>
        {status === "available" && (
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

        {isBorrowType && (status === "reserved" || status === "pickUpAllowed") && (
          <ReservationSection>
            <SubTitle>Reserverad av dig</SubTitle>
            <p>
              {convertToSwedishDate(activeReservation?.dateStart ?? "")} -{" "}
              {convertToSwedishDate(activeReservation?.dateEnd ?? "")}
            </p>
          </ReservationSection>
        )}
      </TopSection>

      <MainSection>
        <Section />
        <Section>
          <h4 className="dark">Beskrivning</h4>
          <p className="description">{item.description}</p>
        </Section>

        <Section>
          <table>
            <tbody>
              <tr>
                <td>
                  <h4>Typ av haffning</h4>
                </td>
                <td>{isRecycleType ? "Återbruk" : "Delning"}</td>
              </tr>

              {isRecycleType && (
                <>
                  <tr>
                    <td>
                      <h4>Höjd</h4>
                    </td>
                    <td>
                      {item.height} <span>cm</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Bredd</h4>
                    </td>
                    <td>
                      {item.width} <span>cm</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Djup</h4>
                    </td>
                    <td>
                      {item.length} <span>cm</span>
                    </td>
                  </tr>
                  {item.color && (
                    <tr>
                      <td>
                        <h4>Färg</h4>
                      </td>
                      <td>{item.color}</td>
                    </tr>
                  )}
                  {itemMaterialsString && (
                    <tr>
                      <td>
                        <h4>Material</h4>
                      </td>
                      <td>{itemMaterialsString}</td>
                    </tr>
                  )}
                  {itemCondition?.title && (
                    <tr>
                      <td>
                        <h4>Skick</h4>
                      </td>
                      <td>{itemCondition?.title}</td>
                    </tr>
                  )}
                  <tr>
                    <td>
                      <h4>Användningsområde</h4>
                    </td>
                    {itemAreaOfUseString ? (
                      <td>{itemAreaOfUseString}</td>
                    ) : (
                      <td />
                    )}
                  </tr>

                  {item.purchasePrice !== "" && (
                    <tr>
                      <td>
                        <h4>Inköpspris</h4>
                      </td>
                      <td>
                        {item.purchasePrice} <span>kr</span>
                      </td>
                    </tr>
                  )}

                  {status === "available" && (
                    <tr>
                      <td>
                        <h4>Har varit tillgänglig i</h4>
                      </td>
                      <td>
                        {showDays(item.createdAt)} <span>dagar</span>
                      </td>
                    </tr>
                  )}
                </>
              )}

              {item.climateImpact && (
                <tr>
                  <td>
                    <h4>Klimatpåverkan</h4>
                  </td>
                  <td>
                    {item.climateImpact}{" "}
                    <span>
                      kg CO<sub>2</sub>e
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {isBorrowType && item?.accessories && item.accessories.length > 0 && (
            <>
              <div>
                <h4 className="dark">Ingår i paketet</h4>
              </div>
              <table>
                <tbody>
                  {item.accessories.map((accessory: any) => (
                    <tr key={accessory}>
                      <td>
                        <h4>{accessory}</h4>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Section>

        <Section>
          <h4 className="dark">Här finns prylen</h4>

          <Card>
            <div className="cardHeader">
              {item && item.location && (
                <Map mapTypeControl={false} location={item.location} />
              )}

              {!item.location && (
                <Loader
                  type="ThreeDots"
                  color="#9db0c6"
                  height={50}
                  width={50}
                />
              )}
            </div>
            <div className="cardBody">
              <SubTitle>Adress</SubTitle>
              <p>{item.department}</p>
              <p>{item.location}</p>
              <MapButton
                size="lg"
                secondary
                type="button"
                onClick={() => launchNavigation(item.location)}
              >
                Hitta hit
                <MdPlace />
              </MapButton>
            </div>
          </Card>
        </Section>

        {isBorrowType && (
          <Section>
            <h4 className="dark">Hur du haffar ut prylen</h4>
            <Card>
              <div className="cardBody">
                <SubTitle>
                  <DifficultyIcon level={item.borrowDifficultyLevel} />
                  Hur svår att haffa ut?
                </SubTitle>
                <p>
                  {item.borrowDifficultyLevel === "easy" &&
                    "Det går att komma in själv ”från gatan” och hitta prylen för att skanna dess QR-kod utan någon annan inblandad."}
                  {item.borrowDifficultyLevel === "medium" &&
                    "Prylen finns i ett rum som bara de som jobbar där har tillgång till, någon behöver öppna dörren för dig etc."}
                  {item.borrowDifficultyLevel === "hard" &&
                    "Prylen finns i ett låst skåp bakom en låst dörr. Du behöver få tag i en viss person för att få hjälp att komma in."}
                </p>

                <SubTitle>Så Här går det till</SubTitle>
                <p>{item.pickUpInstructions ?? ""}</p>
              </div>
            </Card>
          </Section>
        )}

        <Section>
          <h4 className="dark">Kontaktperson</h4>
          <Card>
            <div className="cardBody">
              <div className="contactPersonDiv">
                <div className="circle">
                  <MdPerson />
                </div>
                <div>
                  <h4 className="dark">{item.contactPerson}</h4>
                  <SubTitle className="company">{item.company}</SubTitle>
                </div>
              </div>
              {item.phoneNumber && (
                <div className="contactInfo">
                  <MdPhone />
                  <a href={telHref}>{item.phoneNumber}</a>
                </div>
              )}

              <div className="contactInfo">
                <FiAtSign />
                <a href={mailtoHref}>{item.email}</a>
              </div>
            </div>
          </Card>
        </Section>
      </MainSection>

      <BottomSection>
        <Line />
        <QRCode id={id} />
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
