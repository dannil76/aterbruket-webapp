import { useState, useEffect } from "react";
import { useQrCamera } from "../QrCamera";
import { IAdvert } from "../../interfaces/IAdvert";

interface Props {
  advert: IAdvert;
}

const useItemDetailsModal = ({
  advert,
}: Props): [
  number,
  boolean,
  (result: string) => void,
  () => void,
  () => void,
  () => void
] => {
  const [step, setStep] = useState<number>(0);
  const [result, setResult] = useQrCamera();
  const [isQrResultValid, setIsQrResultValid] = useState<boolean>(false);

  const reset = () => {
    setStep(0);
    setResult("");
    setIsQrResultValid(false);
  };

  const next = () => {
    setStep(step + 1);
  };

  const prev = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    if (typeof result === "string" && result === advert.id) {
      setIsQrResultValid(true);
      next();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return [step, isQrResultValid, setResult, next, prev, reset];
};

export default useItemDetailsModal;
