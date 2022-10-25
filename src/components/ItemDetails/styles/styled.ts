import styled from 'styled-components';
import Button from '../../Button';
import { Modal } from '../../Modal';

export const AbortButton = styled(Button)`
    color: ${(props) => props.theme.colors.monoLight};
`;

export const CameraContainer = styled.div`
    border-radius: 9.5px 9.5px 0 0;
    width: 100%;
`;

export const H5 = styled.h5`
    color: ${(props) => props.theme.colors.darkest};
    font-size: 18px;
`;

export const Subtitle = styled(H5)`
    margin-bottom: 0px;
    color: ${(props) => props.theme.colors.primaryDark};
`;

export const Header = styled.h1`
    margin-top: 12px;
`;

export const Code = styled.h1`
    margin-top: 0;
`;

export const Text = styled.p`
    font-size: 20px;
`;

export const Link = styled.i`
    color: ${(props) => props.theme.colors.dark};
    font-size: 16px;
`;

export const LockerModal = styled(Modal.Content)`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    box-sizing: border-box;
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
`;

export const LockerInstructions = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
`;

export const AccessoriesContainer = styled.div`
    margin-bottom: 24px;

    h5 {
        margin-bottom: 0px;
        margin-top: 16px;
        color: ${(props) => props.theme.colors.primary};
    }
`;

export const ButtonContainer = styled.div`
    margin-top: 24px;
    display: flex;
    justify-content: space-between;

    ${AbortButton} {
        margin-right: 16px;
    }
`;
