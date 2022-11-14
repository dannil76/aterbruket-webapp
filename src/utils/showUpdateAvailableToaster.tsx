import React from 'react';
import { toast } from 'react-toastify';

function ToasterUpdateInfo() {
    return (
        <>
            <h4>
                En ny version har släppts.Stäng ner alla flikar för att
                uppdatera.
            </h4>
        </>
    );
}

export default function showUpdateAvailableToaster(): string | number | null {
    const showUpdateAvailable = localStorage.getItem(
        'HaffaApp:showUpdateAvailableToaster',
    );

    return !(showUpdateAvailable === 'false')
        ? toast.warning(<ToasterUpdateInfo />, {
              autoClose: false,
              toastId: 'prevent-duplicate-id',
              closeOnClick: false,
          })
        : null;
}
