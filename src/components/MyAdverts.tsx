import API, { GraphQLResult } from '@aws-amplify/api';
import { graphqlOperation } from 'aws-amplify';
import React, { FC, useContext, useEffect, useState, useCallback } from 'react';
import AdvertContainer from './AdvertContainer';
import { SearchAdvertsQuery } from '../graphql/models';
import { searchAdverts } from '../graphql/queries';
import UserContext from '../contexts/UserContext';
import Pagination from './Pagination';

const MyAdverts: FC = () => {
    const { user } = useContext(UserContext);
    const [adverts, setAdverts] = useState([{}]) as any;
    const [paginationOption, setPaginationOption] = useState({
        activePage: 1,
        totalPages: 1, // Will change after the fetch
        amountToShow: 15,
        itemLength: 14, // Will change after the fetch
    });
    const [renderItems, setRenderItems] = useState([]) as any;

    const handlePages = (updatePage: number) => {
        setPaginationOption({
            ...paginationOption,
            activePage: updatePage,
        });

        if (paginationOption.activePage !== updatePage) {
            const start = (updatePage - 1) * paginationOption.amountToShow;
            const end = start + paginationOption.amountToShow;

            setRenderItems(adverts.slice(start, end));
        }
    };

    const fetchCreatedAdverts = useCallback(async () => {
        const result = (await API.graphql(
            graphqlOperation(searchAdverts, {
                filter: {
                    and: [{ giver: { eq: user.sub } }, { version: { eq: 0 } }],
                    not: { status: { eq: 'pickedUp' } },
                },
            }),
        )) as GraphQLResult<SearchAdvertsQuery>;

        const advertTotal = result.data?.searchAdverts?.total ?? 0;
        const advertItems = result.data?.searchAdverts?.items ?? [];
        if (advertTotal > 0) {
            setPaginationOption({
                ...paginationOption,
                totalPages: Math.ceil(
                    advertTotal / paginationOption.amountToShow,
                ),
                itemLength: advertTotal,
            });
            setRenderItems(advertItems.slice(0, paginationOption.amountToShow));
        }
        setAdverts(advertItems);
    }, [user.sub]);

    useEffect(() => {
        if (user.sub) {
            fetchCreatedAdverts();
        }
    }, [user]);
    return (
        <>
            <AdvertContainer
                activeFilterOptions={[]}
                items={renderItems}
                searchValue={false}
                itemsFrom="myAdds"
                activeSorting={undefined}
            />
            {renderItems.length > 0 && (
                <Pagination
                    paginationOption={paginationOption}
                    handlePagination={handlePages}
                />
            )}
        </>
    );
};

export default MyAdverts;
