/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Amplify, ServiceWorker } from 'aws-amplify';
import ReactPWAInstallProvider from 'react-pwa-install';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import awsExports from './aws-exports';

ReactDOM.render(
    <ReactPWAInstallProvider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </ReactPWAInstallProvider>,
    document.getElementById('root'),
);

const awsConfiguration: any = awsExports;
awsConfiguration['authenticationFlowType'] = 'USER_PASSWORD_AUTH';

Amplify.configure(awsConfiguration);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
const serviceWorker = new ServiceWorker();

// Pick up if a new update is available
(window as any).isUpdateAvailable = new Promise(function registerServiceWorker(
    resolve,
) {
    serviceWorker.register().then((reg: unknown) => {
        const registration = reg as any;

        // Check if there is any service worker waiting for activation
        if (registration.waiting) {
            resolve(true);
        }

        // add listener on any updating service workers.
        registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = () => {
                // Notify when the new service worker is installed and waiting
                switch (installingWorker.state) {
                    case 'installed':
                        if (navigator.serviceWorker.controller) {
                            // new update available
                            resolve(true);
                        } else {
                            // no update available
                            resolve(false);
                        }
                        break;
                    default: {
                        break;
                    }
                }
            };
        });
    });
});
