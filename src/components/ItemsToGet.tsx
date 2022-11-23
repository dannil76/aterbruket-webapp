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
import { Advert, BorrowStatus, SearchAdvertsQuery } from '../graphql/models';
import UserContext from '../contexts/UserContext';
import { searchAdverts } from '../graphql/queries';
import { PaginationOptions } from '../models/pagination';

interface IListAdvertsFilter {
    not?: { status: { eq: string } };
    and: ({ version: { eq: number } } | { advertType: { eq: string } })[];
}

const AdvertContainer = React.lazy(() => import('./AdvertContainer'));
const Pagination = React.lazy(() => import('./Pagination'));

const ItemsToGet: FC = () => {
    const { user } = useContext(UserContext);
    const [reservedItems, setReservedItems] = useState([] as Advert[]);
    const [activePage, setActivePage] = useState(1);

    const [paginationOption, setPaginationOption] = useState({
        totalPages: 1, // Will change after the fetch
        amountToShow: 30,
        itemLength: 14, // Will change after the fetch
    } as PaginationOptions);
    const [renderItems, setRenderItems] = useState([] as Advert[]);

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
    ): Promise<(Advert | null)[]> => {
        const result = (await API.graphql(
            graphqlOperation(searchAdverts, {
                filter: searchAdvertsFilter,
                sort: { direction: 'desc', field: 'createdAt' },
            }),
        )) as GraphQLResult<SearchAdvertsQuery>;

        if (!result.data?.searchAdverts?.nextToken) {
            return result.data?.searchAdverts?.items ?? [];
        }

        const resultList = result.data?.searchAdverts?.items ?? [];
        let token = result.data?.searchAdverts?.nextToken as
            | string
            | null
            | undefined;
        while (token) {
            // eslint-disable-next-line no-await-in-loop
            const nextResult = (await API.graphql(
                graphqlOperation(searchAdverts, {
                    filter: searchAdvertsFilter,
                    sort: { direction: 'desc', field: 'createdAt' },
                    nextToken: token,
                }),
            )) as GraphQLResult<SearchAdvertsQuery>;

            token = nextResult.data?.searchAdverts?.nextToken;
            const newList = nextResult.data?.searchAdverts?.items ?? [];
            resultList.push(...newList);
        }

        return resultList;
    };

    const storeFetchResult = (itemsToStore: Advert[]) => {
        setReservedItems(itemsToStore);
    };

    const filterBorrowedItems = (
        advertBorrowedItems: Advert[],
        filterUserSub: undefined | string,
        statusFilter: string[],
    ) => {
        if (typeof filterUserSub === 'undefined') {
            return [];
        }

        return advertBorrowedItems.filter((borrowedItem) => {
            return borrowedItem?.advertBorrowCalendar?.calendarEvents?.some(
                (event) => {
                    return (
                        borrowedItem.version === 0 &&
                        event.borrowedBySub === user.sub &&
                        statusFilter.some((status) => status === event.status)
                    );
                },
            );
        });
    };

    const filterReservedItems = (
        advertReservedItems: Advert[],
        filterUserSub: undefined | string,
    ) => {
        if (typeof filterUserSub === 'undefined') {
            return [];
        }

        return advertReservedItems.filter((item) => {
            return item?.advertPickUps?.some((event) => {
                return event.reservedBySub === filterUserSub && !event.pickedUp;
            });
        });
    };

    const fetchAllReservations = useCallback(async () => {
        const borrowedAdsFilter = {
            and: [
                {
                    advertType: { eq: 'borrow' },
                    version: { eq: 0 },
                    status: { ne: 'pickedUp' },
                },
            ],
        };
        const reservedAdsFilter = {
            and: [
                {
                    version: { eq: 0 },
                    advertType: { eq: 'recycle' },
                    status: { ne: 'pickedUp' },
                },
            ],
        };

        const borrowedAds = await fetchListAdverts(borrowedAdsFilter);
        const borrowedAdsItems =
            (borrowedAds.filter((item) => item) as Advert[] | undefined) ?? [];
        const foundResult = filterBorrowedItems(borrowedAdsItems, user.sub, [
            BorrowStatus.reserved,
            BorrowStatus.pickedUp,
        ]);

        const reservedAds = await fetchListAdverts(reservedAdsFilter);
        const reservedAdsItems =
            (reservedAds.filter((item) => item) as Advert[] | undefined) ?? [];
        const filtered = filterReservedItems(reservedAdsItems, user.sub);

        storeFetchResult(foundResult.concat(filtered));
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
        const haffaItems = renderItems.filter((renderItem: Advert) => {
            return renderItem.advertPickUps?.some(
                (pickUp) =>
                    !pickUp.pickedUp && pickUp.reservedBySub === user.sub,
            );
        });

        const borrowItems = filterBorrowedItems(renderItems, user.sub, [
            BorrowStatus.reserved,
        ]);

        return [...haffaItems, ...borrowItems];
    };

    const listPickedUpItems = () => {
        const haffaItems = renderItems.filter((renderItem: Advert) => {
            return renderItem.advertPickUps?.some(
                (pickUp) =>
                    pickUp.pickedUp && pickUp.reservedBySub === user.sub,
            );
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
