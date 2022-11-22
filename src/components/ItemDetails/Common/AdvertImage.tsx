import React from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
    width: 100%;
    max-height: 380px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
`;

interface Props {
    src: string | undefined;
    alt: string | undefined;
    onClick?: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
}

const AdvertImage: React.FC<Props> = ({ src, alt, onClick }) => {
    if (!src) {
        return <></>;
    }

    return (
        <ImageContainer onClick={onClick}>
            <img src={src} alt={alt} />
        </ImageContainer>
    );
};

export default AdvertImage;
