import React from 'react';
import { toast } from 'react-toastify';

function ToasterUpdateInfo() {
    return (
        <>
            <h4>
                En ny version har släppts.Stäng ner alla Haffa flikar för att
                uppdatera.
            </h4>
        </>
    );
}

function ToasterAppUpdateInfo() {
    return (
        <>
            <h4>
                En ny version har släppts. Stäng ner Haffa Appen för att
                uppdatera
            </h4>
        </>
    );
}

export default function showUpdateAvailableToaster(
    isInstalled: boolean,
): string | number | null {
    const showUpdateAvailable = localStorage.getItem(
        'HaffaApp:showUpdateAvailableToaster',
    );

    if (isInstalled) {
        return !(showUpdateAvailable === 'false')
            ? toast.warning(<ToasterAppUpdateInfo />, {
                  autoClose: false,
                  toastId: 'prevent-duplicate-id',
                  closeOnClick: false,
              })
            : null;
    }

    return !(showUpdateAvailable === 'false')
        ? toast.warning(<ToasterUpdateInfo />, {
              autoClose: false,
              toastId: 'prevent-duplicate-id',
              closeOnClick: false,
          })
        : null;
}
