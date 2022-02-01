import { useState } from "react";

const useQrReader = (): [string | null, (result: string) => void] => {
  const [result, setResult] = useState<string | null>(null);

  const handleSetResult = (result: string) => {
    setResult(result);
  };

  return [result, handleSetResult];
};

export default useQrReader;
