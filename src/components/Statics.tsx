/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
import React, { useEffect, useState, FC, useContext } from 'react';
import { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { API } from 'aws-amplify';
import styled from 'styled-components';
import { searchAdverts } from '../graphql/queries';
import { SearchAdvertsQuery } from '../graphql/models';
import UserContext from '../contexts/UserContext';
import CardStatics from './CardStatics';
import filterStatus from '../hooks/filterStatus';
import { allCategories } from '../static/categories';

const StaticContainer = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const SelectWrapper = styled.div`
    width: 100%;
    margin-top: 32px;

    select {
        width: 100%;
        font-weight: 700;
        border-radius: 4.5px;
        border: none;
        font-size: 18px;
        height: 50px;
        padding: 12px 12px 12px 24px;
        color: ${(props) => props.theme.colors.darker};
        background-color: ${(props) => props.theme.colors.grayLighter};
        ::placeholder {
            font-style: italic;
        }
    }
`;

const InfoWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    margin: 48px 16px 0 16px;

    h3 {
        color: ${(props) => props.theme.colors.darkest};
        padding-left: 8px;
        margin-block-start: 0;
        margin-block-end: 16px;
    }
`;

const GroupDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-sizing: border-box;
  height: 74px;
  min-width: 382px
  border: 1px solid ${(props) => props.theme.colors.illustration};
  border-radius: 9.5px;
  color: ${(props) => props.theme.colors.primaryDark};

  background-color: ${(props) => props.theme.colors.primaryLighter};
  margin-bottom: 8px;
  padding: 24px;

  .group {
    display: flex;
    flex-direction: row;

  }

  .amount {
    font-weight: 500;
    color: ${(props) => props.theme.colors.secondaryDark};
    margin-right: 23px;
    margin-left: 4px;
  }

  .iconContainer {
    display: flex;
    flex-direction: column;

    color: ${(props) => props.theme.colors.secondaryDark};
  }
`;

const Statics: FC = () => {
    const ATERBRUKETADRESS = 'Larmvägen 33';
    const [allItems, setAllItems] = useState([]) as any;
    const [allItemsOverTime, setAllItemsOverTime] = useState() as any;
    const [statusGroupOverTime, setStatusGroupOverTime] = useState([]) as any;
    const [statusGroup, setStatusGroup] = useState([]) as any;
    const { user } = useContext(UserContext);
    const [selectDepartment, setSelectDepartment] = useState([
        { title: 'Alla förvaltningar', filterOn: 'all' },
        { title: 'Återbruket', filterOn: ATERBRUKETADRESS },
    ]);
    const [selected, setSelected] = useState('all');

    const fetchItems = async () => {
        const result = (await API.graphql(
            graphqlOperation(searchAdverts, {
                filter: { version: { eq: 0 } },
                sort: {
                    direction: 'desc',
                    field: 'createdAt',
                },
            }),
        )) as GraphQLResult<SearchAdvertsQuery>;
        const advertItems = result.data?.searchAdverts?.items;
        setAllItems(advertItems);
        const res = filterStatus(advertItems, allCategories);
        setStatusGroup(res);
    };

    const fetchItemsOverTime = async () => {
        const result = (await API.graphql(
            graphqlOperation(searchAdverts, {
                sort: {
                    direction: 'desc',
                    field: 'createdAt',
                },
            }),
        )) as GraphQLResult<SearchAdvertsQuery>;
        const advertItems = result.data?.searchAdverts?.items;
        const res = filterStatus(advertItems, allCategories);
        setAllItemsOverTime(advertItems);

        setStatusGroupOverTime(res);
    };

    useEffect(() => {
        fetchItemsOverTime();
        fetchItems();

        if (user.sub) {
            setSelectDepartment([
                ...selectDepartment,
                { title: 'Min statistik', filterOn: user.sub },
            ]);
        }
    }, []);

    const filterItems = (filterOn: string) => {
        let filteredItems = [] as any;
        if (filterOn === 'all') {
            filteredItems = allItems;
        } else if (filterOn === ATERBRUKETADRESS) {
            filteredItems = allItems.filter((item: any) => {
                return item.address.includes(filterOn);
            });
        } else {
            filteredItems = allItems.filter((item: any) => {
                return item.giver === filterOn;
            });
        }

        const res = filterStatus(filteredItems, allCategories);
        setStatusGroup(res);
    };

    const filterItemsAllOverTime = (filterOn: string) => {
        let filteredItems = [] as any;
        if (filterOn === 'all') {
            filteredItems = allItems;
        } else if (filterOn === ATERBRUKETADRESS) {
            filteredItems = allItemsOverTime.filter((item: any) => {
                return item.address.includes(filterOn);
            });
        } else {
            filteredItems = allItemsOverTime.filter((item: any) => {
                return item.giver === filterOn;
            });
        }

        const res = filterStatus(filteredItems, allCategories);
        setStatusGroupOverTime(res);
    };

    const handleInputChange = (e: React.ChangeEvent<any>) => {
        setSelected(e.target.value);
        filterItems(e.target.value);
        filterItemsAllOverTime(e.target.value);
    };

    return (
        <StaticContainer>
            <SelectWrapper>
                <select
                    name="selectDepartment"
                    id="selectDepartment"
                    onChange={(e) => handleInputChange(e)}
                    defaultValue={selected}
                >
                    {selectDepartment.map(
                        (which: { title: string; filterOn: string }) => {
                            return (
                                <option
                                    key={which.title}
                                    value={which.filterOn}
                                >
                                    {which.title}
                                </option>
                            );
                        },
                    )}
                </select>
            </SelectWrapper>
            <InfoWrapper>
                <h3>Just nu</h3>
                {statusGroup.map((group: any) => {
                    return (
                        <CardStatics
                            group={group}
                            key={group.sweOp}
                            filterItems={filterItems}
                            specialHeading={group.sweOp}
                        />
                    );
                })}
            </InfoWrapper>
            <InfoWrapper>
                <h3>Totalt över tid</h3>
                {statusGroupOverTime.map((group: any, idx: number) => {
                    if (idx === 0) {
                        return (
                            <CardStatics
                                group={group}
                                key={group.sweOp}
                                filterItems={filterItemsAllOverTime}
                                specialHeading="Totalt inlagda annonser"
                            />
                        );
                    }

                    return (
                        <CardStatics
                            group={group}
                            key={group.sweOp}
                            filterItems={filterItemsAllOverTime}
                            specialHeading={group.sweOp}
                        />
                    );
                })}
            </InfoWrapper>
        </StaticContainer>
    );
};

export default Statics;
