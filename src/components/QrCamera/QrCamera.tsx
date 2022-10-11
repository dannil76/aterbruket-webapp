/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import React, { FC } from "react";
import QrReader from "react-qr-reader";
import styled from "styled-components";

const CameraContainer = styled.section`
  text-align: center;
  @media only screen and (max-width: 600px) {
    width: 100%;
    height: 100%;
  }

  @media only screen and (min-width: 601px) {
    width: 50%;
    height: 50%;
  }
`;

interface Props {
  setResult: (result: string) => void;
}

const QrCamera: FC<Props> = ({ setResult }: Props) => {
  const handleScan = (result: any): any => {
    if (result) {
      setResult(result);
    }
  };

  const handleError = (err: any): any => {
    console.error(err);
  };

  return (
    <CameraContainer>
      <QrReader
        delay={500}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%", borderRadius: "9.5px 9.5px 0 0" }}
        showViewFinder
      />
    </CameraContainer>
  );
};

export default QrCamera;
