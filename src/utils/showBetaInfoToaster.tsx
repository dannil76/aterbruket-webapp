import React from "react";
import { toast } from "react-toastify";

const showToasterBetaInfo = localStorage.getItem(
  "HaffaApp:showToasterBetaInfo"
);

const handleClose = () => {
  localStorage.setItem("HaffaApp:showToasterBetaInfo", "false");
};

const ToasterBetaInfo = () => (
  <>
    <h2>Det här är en betaversion! Hör gärna av dig med feedback.</h2>
    <a href="mailto:tommy.boije@helsingborg.se?subject=Haffa - Feedback betaversion">
      tommy.boije@helsingborg.se
    </a>
  </>
);

const showBetaInfoToaster: () => string | number | null = () => {
  return !(showToasterBetaInfo === "false")
    ? toast.warning(<ToasterBetaInfo />, {
        autoClose: false,
        toastId: "prevent-duplicate-id",
        closeOnClick: false,
        onClose: handleClose,
      })
    : null;
};

export default showBetaInfoToaster;
