import { AuthState } from '@aws-amplify/ui-components';
import React, { FC, Suspense, useContext, useEffect, useState } from 'react';
import { getItemsToPickup, getPickedUpItems } from '../api';
import UserContext from '../contexts/UserContext';
import { Advert } from '../graphql/models';
import { DEFAULTSORTVALUE } from '../models/sort';

const AdvertContainer = React.lazy(() => import('./AdvertContainer'));
const Pagination = React.lazy(() => import('./Pagination'));

const ItemsToGet: FC = () => {
    const { user } = useContext(UserContext);
    const amountToShow = 30;

    const [activeReservedPage, setActiveReservedPage] = useState(1);
    const [activePickedupPage, setActivePickedupPage] = useState(1);

    const [reservedItems, setReservedItems] = useState([] as Advert[]);
    const [renderReserveItems, setRenderReservedItems] = useState(
        [] as Advert[],
    );
    const [renderPickedupItems, setRenderPickedupItems] = useState(
        [] as Advert[],
    );
    const [pickedUpItems, setPickedUpItems] = useState([] as Advert[]);
    const { authState } = useContext(UserContext);

    const getStartIndex = function getStartIndex(activePage: number) {
        return (activePage - 1) * amountToShow;
    };

    const getLastIndex = function getLastIndex(activePage: number) {
        return activePage * amountToShow;
    };

    const getTotalPages = function getTotalPages(items: Advert[]) {
        return Math.ceil(items.length / amountToShow);
    };

    useEffect(() => {
        setRenderPickedupItems(
            pickedUpItems.slice(
                getStartIndex(activePickedupPage),
                getLastIndex(activePickedupPage),
            ),
        );
    }, [pickedUpItems, activePickedupPage]);

    useEffect(() => {
        setRenderReservedItems(
            reservedItems.slice(
                getStartIndex(activeReservedPage),
                getLastIndex(activeReservedPage),
            ),
        );
    }, [reservedItems, activeReservedPage]);

    useEffect(() => {
        if (authState === AuthState.SignedIn) {
            getItemsToPickup(user.sub).then((reserved) => {
                setActiveReservedPage(1);
                setReservedItems(reserved);
            });

            getPickedUpItems(user.sub).then((pickedUp) => {
                setActivePickedupPage(1);
                setPickedUpItems(pickedUp);
            });
        }
    }, [authState, user.sub]);

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <AdvertContainer
                    activeFilterOptions={[]}
                    searchValue={false}
                    items={renderReserveItems}
                    itemsFrom="haffat"
                    activeSorting={DEFAULTSORTVALUE}
                />
                {renderReserveItems.length > 0 && (
                    <Pagination
                        totalPages={getTotalPages(renderReserveItems)}
                        activePage={activeReservedPage}
                        handlePagination={setActiveReservedPage}
                    />
                )}
                <AdvertContainer
                    activeFilterOptions={[]}
                    searchValue={false}
                    items={renderPickedupItems}
                    itemsFrom="pickedUp"
                    activeSorting={DEFAULTSORTVALUE}
                    greyOut
                />
                {renderPickedupItems.length > 0 && (
                    <Pagination
                        totalPages={getTotalPages(renderPickedupItems)}
                        activePage={activePickedupPage}
                        handlePagination={setActivePickedupPage}
                    />
                )}
            </Suspense>
        </>
    );
};

export default ItemsToGet;
