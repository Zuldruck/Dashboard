import { UserAgentApplication } from 'msal';

const msalConfig = {
    auth: {
        clientId: '49d929ab-7b66-4821-aab3-43254d62b4eb',
        redirectUri: 'https://localhost:3000'
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
    }
};

export const msalInstance = new UserAgentApplication(msalConfig);