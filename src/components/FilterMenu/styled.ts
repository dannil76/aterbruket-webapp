import styled from 'styled-components';

export const FilterCtn = styled.div`
    display: ${({ className }) => (className === 'show' ? 'block' : 'none')};
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 98vh;
    background-color: #fcfcfc;
    border-radius: 15px 15px 0 0;
    box-shadow: 0px 0px 2px black;
    overflow: scroll;
`;

export const FilterHeader = styled.div`
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    border-radius: 15px 15px 0 0;
    position: fixed;
    top: 1.8vh;
    background-color: #fcfcfc;

    .pageTitle {
        margin: 0 16px;
    }

    .cancelBtn {
        position: fixed;
        top: 25px;
        right: 15px;
        width: 32px;
        height: 32px;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: none;
        background-color: transparent;
    }

    .cancelIcon {
        color: #205400;
        font-size: 35px;
    }
`;

export const FilterBody = styled.div`
    width: 90%;
    background-color: #fcfcfc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-coten: center;
    margin-top: 120px;
    margin-bottom: 20px;
    z-index: 1;
    padding: 16px;
`;

export const SaveButton = styled.button`
    border: none;
    width: 350px;
    height: 56px;
    border-radius: 4.5px;
    font-weight: 500;
    background-color: ${(props) => props.theme.colors.primary};
    font-size: 18px;
    color: white;
    background-color: #50811b;
`;

export const ResetButton = styled.button`
    display: block;
    border: none;
    width: 135px;
    height: 24px;
    font-weight: 500;
    line-height: 23.76px;
    margin-top: 24px;
    text-align: center;
    padding: 0;
    color: #a3a3a3;
    background-color: white;
`;
