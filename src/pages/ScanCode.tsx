import React, { FC, Suspense } from "react";
import { Redirect } from "react-router-dom";

const OpenCamera = React.lazy(() => import("../components/OpenCamera"));

interface IQrCamera {
  delay: number;
  result: string;
}

interface Props {
  qrCamera: IQrCamera;
  setQrCamera: React.Dispatch<
    React.SetStateAction<{
      delay: number;
      result: string;
    }>
  >;
}

const ScanCode: FC<Props> = ({ qrCamera, setQrCamera }: Props) => {
  if (qrCamera.result.length > 2) {
    return <Redirect to={`/item/${qrCamera.result}`} />;
  }
  return (
    <main style={{ marginBottom: "0px" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <OpenCamera qrCamera={qrCamera} setQrCamera={setQrCamera} />
      </Suspense>
    </main>
  );
};

export default ScanCode;
