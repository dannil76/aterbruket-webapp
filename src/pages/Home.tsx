import React, { FC, useState, useEffect, useContext, Suspense } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { MdNewReleases, MdSearch, MdTune, MdPhotoCamera } from 'react-icons/md';
import { AuthState } from '@aws-amplify/ui-components';
import { ItemStatus } from '../graphql/models';
import UserContext from '../contexts/UserContext';
import { advertTypes } from '../static/advertMeta';
import { IOption } from '../interfaces/IForm';
import { Modal, useModal } from '../components/Modal';
import { useQrCamera } from '../components/QrCamera';
import QrModal from '../components/QrModal';
import { showUpdateAvailableToaster, showBetaInfoToaster } from '../utils';
import { DEFAULTSORTVALUE } from '../models/sort';
import { HaffaFilter } from '../models/filter';
import { getItemsFromApi } from '../api/items';
import { PaginationOptions } from '../models/pagination';

const tokenInitialValue = 'initial';

const AdvertContainer = React.lazy(
    () => import('../components/AdvertContainer'),
);
const FilterMenu = React.lazy(
    () => import('../components/FilterMenu/FilterMenu'),
);
const ModalAddItemContent = React.lazy(
    () => import('../components/ModalAddItemContent'),
);
const Pagination = React.lazy(() => import('../components/Pagination'));

const AddBtn = styled.button`
    position: fixed;
    bottom: 100px;
    background-color: ${(props) => props.theme.colors.primaryDark};
    color: white;
    display: flex;
    align-items: center;
    border: 0;
    padding: 0px 0px 0px 12px;
    width: 90%;
    max-width: 700px;
    height: 50px;
    border-radius: 14.5px;
    box-shadow: 0px 0px 2px rgba(98, 98, 98, 0.18),
        0px 3px 2px rgba(98, 98, 98, 0.12), 0px 6px 8px rgba(98, 98, 98, 0.12),
        0px 10px 16px rgba(98, 98, 98, 0.12),
        0px 26px 32px rgba(98, 98, 98, 0.12);
    font-weight: 500;
    font-size: 18px;

    p {
        margin-left: 8px;
    }
    svg {
        font-size: 25px;
    }
`;

const ScanBtn = styled.button`
    border: none;
    width: 56px;
    height: 56px;
    background-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0px 0px 2px rgba(98, 98, 98, 0.18),
        0px 3px 2px rgba(98, 98, 98, 0.12), 0px 6px 8px rgba(98, 98, 98, 0.12),
        0px 10px 16px rgba(98, 98, 98, 0.12),
        0px 26px 32px rgba(98, 98, 98, 0.12);
    border-radius: 34.5px;
    position: fixed;
    top: 13vh;
    right: 30px;
    outline: none;
    z-index: 11;

    svg {
        color: white;
        border-radius: 4px;
        font-size: 36px;
        padding-top: 5px;
        padding-right: 1px;
    }
`;

const SearchFilterDiv = styled.div`
    width: 100%;
    max-width: 600px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    input {
        font-size: 16px;
    }

    .searchWrapper {
        position: relative;

        #searchIcon {
            color: ${(props) => props.theme.colors.primaryDark};
            position: absolute;
            top: 43px;
            left: 13px;
            font-size: 22px;
        }

        #searchInput {
            width: 240px;
            height: 25px;
            margin: 30px 0;
            padding: 12px 0px 12px 40px;
            display: flex;
            align-items: flex-start;
            border-radius: 17.5px;
            border: none;
            background-color: ${(props) => props.theme.colors.grayLighter};
        }
    }

    #filterBtn {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 80px;
        line-height: 16px;
        font-size: 16px;
        border: none;
        background-color: transparent;
        color: ${(props) => props.theme.colors.darkest};

        .filterIcon {
            color: ${(props) => props.theme.colors.primaryDark};
            font-size: 18px;
        }
    }
`;

const MessageCtn = styled.div`
    width: 50%;
    text-align: center;

    .filterIcon {
        font-size: 7rem;
        color: #e5e5e5;
    }

    .message {
        margin-bottom: 50px;
    }
`;

const Spacer = styled.div`
    width: 100%;
    height: 72px;
`;

const QrModalContent = styled.div`
    text-align: center;
`;

interface Item {
    condition: string;
}

const Home: FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const updateSearch = (event: React.ChangeEvent<any>) => {
        const { target } = event;
        const { value } = target;
        setSearchValue(value);
    };
    const [paginationOption, setPaginationOption] = useState({
        totalPages: 0, // Will change after the fetch
        amountToShow: 15,
        itemLength: 14, // Will change after the fetch
    } as PaginationOptions);

    const [activePage, setActivePage] = useState(1);

    const [items, setItems] = useState([]) as any;
    const [filterValueUpdated, setFilterValueUpdated] = useState(false);
    const [activeFilters, setActiveFilters] = useState<HaffaFilter>(
        {} as HaffaFilter,
    );
    const [error, setError] = useState(false);
    const [nextToken, setToken] = useState<string | undefined>(
        tokenInitialValue,
    );
    const [filterValue, setFilterValue] = useState({
        version: { eq: 0 },
        status: { eq: ItemStatus.available },
        or: [],
    }) as any;
    const [renderItems, setRenderItems] = useState([]) as any;
    const { authState } = useContext(UserContext);
    const [activeSorting, setActiveSorting] = useState(DEFAULTSORTVALUE);

    const getStartIndex = function getStartIndex() {
        return (activePage - 1) * paginationOption.amountToShow;
    };

    const getLastIndex = function getLastIndex() {
        return activePage * paginationOption.amountToShow;
    };

    useEffect(() => {
        setRenderItems(items.slice(getStartIndex(), getLastIndex()));
    }, [items, activePage]);

    useEffect(() => {
        // Sanity check don't handle page change before first fetch
        if (activePage === 0) {
            return;
        }

        if (authState === AuthState.SignedIn) {
            getItemsFromApi(
                activePage,
                paginationOption.amountToShow,
                activeSorting,
                nextToken,
                items,
                activeFilters,
                searchValue,
                setToken,
                setPaginationOption,
            ).then((newItems) => {
                setItems(newItems);
            });
        }
    }, [activePage]);

    useEffect(() => {
        if (authState === AuthState.SignedIn) {
            getItemsFromApi(
                activePage,
                paginationOption.amountToShow,
                activeSorting,
                undefined,
                [],
                activeFilters,
                searchValue,
                setToken,
                setPaginationOption,
            ).then((newItems) => {
                setActivePage(1);
                setItems(newItems);
            });
        }
    }, [
        authState,
        filterValueUpdated,
        activeFilters,
        activeSorting,
        searchValue,
    ]);

    useEffect(() => {
        showBetaInfoToaster();
    }, []);

    // Check if there is any update on service workers
    useEffect(() => {
        const updateServiceWorker = async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const w = window as any;
            const checkUpdateAvailable =
                w.isUpdateAvailable as Promise<boolean>;

            const isUpdateAvailable = await checkUpdateAvailable;
            if (isUpdateAvailable) {
                showUpdateAvailableToaster();
            }
        };

        updateServiceWorker();
    }, []);

    const filterOptions = [...advertTypes];

    const activeFilterOptions = filterOptions.filter((item: IOption) => {
        return (
            (item.key === 'borrow' && activeFilters.advertTypes?.borrow) ||
            (item.key === 'recycle' && activeFilters.advertTypes?.recycle)
        );
    });

    const [isModalVisible, toggleModal] = useModal();
    const [isQrModalVisible, toggleQrModal] = useModal();
    const [qrCameraresult, setQrCameraResult] = useQrCamera();

    if (qrCameraresult !== null) {
        return <Redirect to={`/item/${qrCameraresult}`} />;
    }

    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <QrModal
                    isVisible={isQrModalVisible}
                    toggleModal={toggleQrModal}
                    setResult={setQrCameraResult}
                >
                    <QrModalContent>
                        <h1>Skanna QR-kod</h1>
                    </QrModalContent>
                </QrModal>

                <Modal isVisible={isModalVisible}>
                    <Modal.Body autoHeight>
                        <ModalAddItemContent
                            toggleModal={toggleModal}
                            toggleQrModal={toggleQrModal}
                        />
                    </Modal.Body>
                </Modal>

                <ScanBtn
                    id="scanBtn"
                    type="button"
                    onClick={() => toggleQrModal()}
                >
                    <MdPhotoCamera />
                </ScanBtn>
                {/* <TabCtn>
            <button type="button">INSPIRATION</button>
            <button type="button">KATEGORIER</button>
          </TabCtn> */}
                <SearchFilterDiv>
                    <div className="searchWrapper">
                        <MdSearch id="searchIcon" />
                        <input
                            id="searchInput"
                            type="text"
                            placeholder="Sök"
                            onChange={updateSearch}
                        />
                    </div>

                    <button
                        onClick={() => setIsOpen(true)}
                        type="button"
                        id="filterBtn"
                    >
                        Filter <MdTune className="filterIcon" />
                    </button>

                    <FilterMenu
                        setActiveFilters={setActiveFilters}
                        setIsOpen={setIsOpen}
                        isOpen={isOpen}
                        filterValue={filterValue}
                        setFilterValue={setFilterValue}
                        setActiveSorting={setActiveSorting}
                    />
                </SearchFilterDiv>
                <AdvertContainer
                    activeFilterOptions={activeFilterOptions}
                    items={renderItems}
                    searchValue={searchValue}
                    itemsFrom="home"
                    activeSorting={activeSorting}
                />
                {items.length > 0 && (
                    <Pagination
                        paginationOption={paginationOption}
                        handlePagination={setActivePage}
                    />
                )}
                {error && (
                    <MessageCtn>
                        <MdTune className="filterIcon" />
                        <h4 className="message">
                            Du råkade visst filtrera bort precis allt{' '}
                        </h4>
                    </MessageCtn>
                )}
                <Spacer />
                <AddBtn type="button" onClick={() => toggleModal()}>
                    <MdNewReleases />
                    <p>Gör en egen annons!</p>
                </AddBtn>
            </Suspense>
        </main>
    );
};

export default Home;
