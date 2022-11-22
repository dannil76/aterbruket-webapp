import API, { GraphQLResult } from '@aws-amplify/api';
import { graphqlOperation } from 'aws-amplify';
import React, {
    FC,
    Suspense,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { BorrowStatus, SearchAdvertsQuery } from '../graphql/models';
import UserContext from '../contexts/UserContext';
import { searchAdverts } from '../graphql/queries';
import { ICalendarDataEvent } from '../interfaces/IDateRange';
import { IAdvert } from '../interfaces/IAdvert';
import { PaginationOptions } from '../models/pagination';

interface IListAdvertsFilter {
    not?: { status: { eq: string } };
    and: (
        | { reservedBySub: { eq: string | undefined } }
        | { version: { eq: number } }
        | { advertType: { eq: string } }
    )[];
}

const AdvertContainer = React.lazy(() => import('./AdvertContainer'));
const Pagination = React.lazy(() => import('./Pagination'));

const ItemsToGet: FC = () => {
    const { user } = useContext(UserContext);
    const [reservedItems, setReservedItems] = useState([]) as any;
    const [activePage, setActivePage] = useState(1);

    const [paginationOption, setPaginationOption] = useState({
        totalPages: 1, // Will change after the fetch
        amountToShow: 30,
        itemLength: 14, // Will change after the fetch
    } as PaginationOptions);
    const [renderItems, setRenderItems] = useState([]) as any;

    const handlePages = (updatePage: number) => {
        setActivePage(updatePage);

        if (activePage !== updatePage) {
            const start = (updatePage - 1) * paginationOption.amountToShow;
            const end = start + paginationOption.amountToShow;

            setRenderItems(reservedItems.slice(start, end));
        }
    };

    const fetchListAdverts = async (
        searchAdvertsFilter: IListAdvertsFilter,
    ): Promise<GraphQLResult<SearchAdvertsQuery>> => {
        return (await API.graphql(
            graphqlOperation(searchAdverts, {
                filter: searchAdvertsFilter,
                sort: { direction: 'desc', field: 'createdAt' },
            }),
        )) as GraphQLResult<SearchAdvertsQuery>;
    };

    const storeFetchResult = (itemsToStore: [IAdvert]) => {
        setReservedItems((currentReservedItems: [IAdvert]) => [
            ...currentReservedItems,
            ...itemsToStore,
        ]);
    };

    const filterBorrowedItems = (
        advertBorrowedItems: any,
        filterUserSub: undefined | string,
        statusFilter: string[],
    ) => {
        if (typeof filterUserSub === 'undefined') {
            return [];
        }

        return advertBorrowedItems.filter((borrowedItem: IAdvert) => {
            const foundElem =
                borrowedItem?.advertBorrowCalendar?.calendarEvents.find(
                    (event: ICalendarDataEvent) => {
                        return (
                            event.borrowedBySub === filterUserSub &&
                            statusFilter.includes(event.status)
                        );
                    },
                );

            return foundElem && borrowedItem;
        });
    };

    const fetchAllReservations = useCallback(async () => {
        const borrowedAdsFilter = {
            and: [{ advertType: { eq: 'borrow' } }, { version: { eq: 0 } }],
        };
        const reservedAdsFilter = {
            and: [{ reservedBySub: { eq: user.sub } }, { version: { eq: 0 } }],
            not: { status: { eq: 'available' } },
        };

        const borrowedAds = await fetchListAdverts(borrowedAdsFilter);
        const borrowedAdsItems: any = borrowedAds.data?.searchAdverts?.items;
        const foundResult = filterBorrowedItems(borrowedAdsItems, user.sub, [
            BorrowStatus.reserved,
            BorrowStatus.pickedUp,
        ]);
        storeFetchResult(foundResult);

        const reservedAds = await fetchListAdverts(reservedAdsFilter);
        const reservedAdsItems: any = reservedAds.data?.searchAdverts?.items;
        storeFetchResult(reservedAdsItems);
    }, [user.sub]);

    useEffect(() => {
        if (user.sub) {
            fetchAllReservations();
        }
    }, [user.sub]);

    useEffect(() => {
        const totalReservedItems = reservedItems.length;
        const { amountToShow } = paginationOption;
        setActivePage(1);
        setPaginationOption({
            amountToShow,
            totalPages: Math.ceil(totalReservedItems / amountToShow),
            itemLength: totalReservedItems,
        });

        setRenderItems(reservedItems.slice(0, amountToShow));
    }, [reservedItems]);

    const listReservedItems = () => {
        const haffaItems = renderItems.filter((renderItem: IAdvert) => {
            return renderItem.status === BorrowStatus.reserved;
        });

        const borrowItems = filterBorrowedItems(renderItems, user.sub, [
            BorrowStatus.reserved,
        ]);

        return [...haffaItems, ...borrowItems];
    };

    const listPickedUpItems = () => {
        const haffaItems = renderItems.filter((renderItem: IAdvert) => {
            return renderItem.status === BorrowStatus.pickedUp;
        });

        const borrowItems = filterBorrowedItems(renderItems, user.sub, [
            BorrowStatus.pickedUp,
        ]);

        return [...haffaItems, ...borrowItems];
    };

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <AdvertContainer
                    activeFilterOptions={[]}
                    searchValue={false}
                    items={listReservedItems()}
                    itemsFrom="haffat"
                    activeSorting={undefined}
                    fetchReservedAdverts={fetchAllReservations}
                />

                <AdvertContainer
                    activeFilterOptions={[]}
                    searchValue={false}
                    items={listPickedUpItems()}
                    itemsFrom="pickedUp"
                    activeSorting={undefined}
                />
                {reservedItems.length > 0 && (
                    <Pagination
                        paginationOption={paginationOption}
                        activePage={activePage}
                        handlePagination={handlePages}
                    />
                )}
            </Suspense>
        </>
    );
};

export default ItemsToGet;
