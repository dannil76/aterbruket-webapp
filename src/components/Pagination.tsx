/* eslint-disable no-nested-ternary */
import React, { FC } from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const Button = styled.button`
    background-color: ${(props) => props.theme.appTheme.primaryColor};
    box-sizing: border-box;
    outline: none;
    cursor: pointer;

    height: 50px;
    width: 50px;
    border: none;
    border-radius: 4px;
    height: 30px;
    width: 45px;
    margin: 0 2px;

    &.active {
        border: 2px solid ${(props) => props.theme.colors.primary};
    }
    &.endButtons {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: center;
    }
    &.endButtons {
        &:hover {
            background-color: ${(props) =>
                props.theme.colors.opacityPrimaryLight};
        }
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    margin: 10px 0 80px 0;
`;

interface Props {
    totalPages: number;
    activePage: number;
    handlePagination: (activePage: number) => void;
}

const Pagination: FC<Props> = ({
    totalPages,
    activePage,
    handlePagination,
}) => {
    // eslint-disable-next-line prefer-const
    let buttonArray: any = [];

    for (let i = 0; i < totalPages; i += 1) {
        buttonArray.push(i + 1);
    }

    const buttons = buttonArray.map((element: any) => {
        return (
            <Button
                key={element}
                type="button"
                onClick={() => handlePagination(element)}
                className={element === activePage ? 'active' : 'not'}
            >
                {element}
            </Button>
        );
    });

    return (
        <ButtonContainer>
            {activePage !== 1 && (
                <Button
                    onClick={() => handlePagination(activePage - 1)}
                    className="endButtons"
                >
                    <MdKeyboardArrowLeft />
                </Button>
            )}
            {buttons}
            {activePage !== totalPages && (
                <Button
                    onClick={() => handlePagination(activePage + 1)}
                    className="endButtons"
                >
                    <MdKeyboardArrowRight />
                </Button>
            )}
        </ButtonContainer>
    );
};

export default Pagination;
