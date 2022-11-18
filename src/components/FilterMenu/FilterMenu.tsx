/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC, useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import { FilterCheckbox, SortRadioButtons } from './FilterFormElements';
import { advertTypes } from '../../static/advertMeta';
import {
    FilterBody,
    FilterCtn,
    FilterHeader,
    ResetButton,
    SaveButton,
} from './styled';
import { DEFAULTSORTVALUE, SortSelection } from '../../models/sort';
import { DefaultHaffaTypeFilter, HaffaFilter } from '../../models/filter';

interface Props {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
    filterValue: any;
    setFilterValue: React.Dispatch<React.SetStateAction<any>>;
    setActiveFilters: React.Dispatch<React.SetStateAction<HaffaFilter>>;
    setActiveSorting: React.Dispatch<React.SetStateAction<SortSelection>>;
}

const FILTER_OPEN_CLASS = 'openFilter';

const FilterMenu: FC<Props> = ({
    isOpen,
    setIsOpen,
    setFilterValue,
    filterValue,
    setActiveFilters,
    setActiveSorting,
}: Props) => {
    const [saveValues, setSaveValues] = useState({} as HaffaFilter);
    const [conditionFilter, setConditionFilter] = useState([] as string[]);
    const [categoryFilter, setCategoryFilter] = useState([] as string[]);
    const [advertTypeFilter, setAdvertTypeFilter] = useState([] as string[]);
    const [sortSelection, setNewSortSelection] = useState(DEFAULTSORTVALUE);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add(FILTER_OPEN_CLASS);
        }

        return () => document.body.classList.remove(FILTER_OPEN_CLASS);
    }, [isOpen]);

    const handleSaveFilter = () => {
        setActiveFilters(saveValues);
        setIsOpen(false);
        setActiveSorting({ ...sortSelection });
    };
    const closeFilter = (e: any) => {
        e.stopPropagation();
        setIsOpen(false);
    };

    const resetFilters = () => {
        setFilterValue({
            ...filterValue,
            or: [],
        });
        setSaveValues({
            advertTypes: DefaultHaffaTypeFilter,
            categories: [],
            conditions: [],
        });
        setActiveFilters({
            advertTypes: DefaultHaffaTypeFilter,
            categories: [],
            conditions: [],
        });
    };

    const handleResetFiltersAndSort = () => {
        resetFilters();
        setActiveSorting(DEFAULTSORTVALUE);
        setNewSortSelection(DEFAULTSORTVALUE);
    };

    useEffect(() => {
        const filter = {
            advertTypes: {
                borrow: advertTypeFilter.some((type) => type === 'borrow'),
                recycle: advertTypeFilter.some((type) => type === 'recycle'),
            },
            categories: categoryFilter,
            conditions: conditionFilter,
        } as HaffaFilter;
        setSaveValues(filter);
    }, [conditionFilter, categoryFilter, advertTypeFilter]);

    return (
        <FilterCtn className={isOpen ? 'show' : 'hide'}>
            <FilterHeader>
                <button
                    className="cancelBtn"
                    onClick={(e) => closeFilter(e)}
                    type="button"
                >
                    <MdCancel className="cancelIcon" />
                </button>
                <h1 className="pageTitle">Filtrera</h1>
            </FilterHeader>
            <FilterBody>
                <SortRadioButtons
                    setNewSortSelection={setNewSortSelection}
                    groupTitle="SORTERING"
                    sortSelection={sortSelection}
                />
                <FilterCheckbox
                    title="Typ av haffning"
                    setSelected={setAdvertTypeFilter}
                    options={advertTypes}
                    selected={advertTypeFilter}
                />
                {/*
                // TODO: Enable this again when we're able to filter on multiple fields, e.g. categories and conditions
                {saveValues.advertTypes?.borrow && (
                    <FilterCheckbox
                        title="Kategorier – delning"
                        setSelected={setCategoryFilter}
                        options={borrowCategories}
                        selected={categoryFilter}
                    />
                )}
                {saveValues.advertTypes?.recycle && (
                    <>
                        <FilterCheckbox
                            title="Kategorier – återbruk"
                            setSelected={setCategoryFilter}
                            options={recycleCategories}
                            selected={categoryFilter}
                        />
                        <FilterCheckbox
                            title="Skick"
                            setSelected={setConditionFilter}
                            options={conditions}
                            selected={conditionFilter}
                        />
                    </>
                )} 
                */}
                <SaveButton type="button" onClick={handleSaveFilter}>
                    Spara
                </SaveButton>
                <ResetButton type="button" onClick={handleResetFiltersAndSort}>
                    Avbryt/ Nollställ
                </ResetButton>
            </FilterBody>
        </FilterCtn>
    );
};

export default FilterMenu;
