import React, { FC } from "react";
import styled from "styled-components";
import Carousel from "styled-components-carousel";
import { Modal } from "../components/Modal";

const CarouselWrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  background-color: white;
  display: flex;

  .closeBtn {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 3;
    margin: 16px;
  }
  //genererat classnam
  .bOCFav {
    height: 100vh;
  }
  //genererat classnam
  .sc-pNWxx {
    display: flex;
  }
  .imgDiv {
    align-self: center;
  }
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    align-self: stretch;
  }
`;

type Props = {
  setShowCarousel: React.Dispatch<React.SetStateAction<boolean>>;
  image: string;
};

const CarouselComp: FC<Props> = ({ setShowCarousel, image }: Props) => {
  return (
    <CarouselWrapper>
      <Modal.CloseButton onClick={() => setShowCarousel(false)} />
      <Carousel
        center
        infinite={false}
        swipeable={false}
        showArrows={false}
        showIndicator={false}
      >
        <div className="imgDiv">
          <img src={image} alt="" />
        </div>
      </Carousel>
    </CarouselWrapper>
  );
};
export default CarouselComp;
