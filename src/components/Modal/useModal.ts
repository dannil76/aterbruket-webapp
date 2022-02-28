import { useState, useEffect } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { isIOS } from "react-device-detect";

const useModal = (): [boolean, () => void] => {
  const [isVisible, setVisible] = useState(false);

  const toggle = () => {
    setVisible(!isVisible);
  };

  useEffect(() => {
    // Bail if iOS because it does not work with package body-scroll-lock
    if (isVisible && !isIOS) {
      disableBodyScroll(document.body);
    } else {
      enableBodyScroll(document.body);
    }
  }, [isVisible]);

  return [isVisible, toggle];
};

export default useModal;
