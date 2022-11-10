import React from 'react';
import ReactDOM from 'react-dom';
import { IntercomProvider } from 'react-use-intercom';
import amplitudePlugin from '@analytics/amplitude';
import googleAnalytics from '@analytics/google-analytics';
import { Auth0Provider } from '@auth0/auth0-react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Analytics from 'analytics';
import doNotTrack from 'analytics-plugin-do-not-track';
import { AnalyticsProvider } from 'use-analytics';

import ThemeProvider from 'web-components/lib/theme/RegenThemeProvider';

import { AuthApolloProvider } from './apollo';
import App from './App';
import { LedgerProvider } from './ledger';
import { WalletProvider } from './lib/wallet';
import * as serviceWorker from './serviceWorker';
// import history from './lib/history';

const config = {
  domain:
    process.env.REACT_APP_AUTH0_DOMAIN || 'regen-network-registry.auth0.com',
  clientId:
    process.env.REACT_APP_AUTH0_CLIENT_ID || 'rEuc1WLPAQVXZ7gJrWg4AL9EhWMHmLu8',
  returnTo: window.location.origin || 'http://localhost:3000/',
  audience: 'https://regen-registry-server.herokuapp.com/',
};

const intercomId = process.env.REACT_APP_INTERCOM_APP_ID || '';

// Create a client
const queryClient = new QueryClient();

// const onRedirectCallback = (appState: AppState) => {
//   // If using a Hash Router, you need to use window.history.replaceState to
//   // remove the `code` and `state` query parameters from the callback url.
//   // window.history.replaceState({}, document.title, window.location.pathname);
//   history.replace((appState && appState.returnTo) || window.location.pathname);
// };

// our current analytics setup uses both amplitude and google analytics.
// our amplitude and GA have been set up with a development and production environment.
// for amplitude this means that we have a development and production API key.
// for GA this means that we have a development and production measurement id.
// be careful not to use the production API key or measurement id in a non-prod environment.
// but you can safely use the development API key and measurement id in non-prod environments.
// these values are safe to hardcode because they are public.
// also see the REACT_APP_ANALYTICS_ENABLED environment variable.
const DEVELOPMENT_AMPLITUDE_API_KEY = 'ef9a9d58cf90476430f62a634d72cd5c';
const DEVELOPMENT_GA_MEASUREMENT_ID = 'G-9ENS4JTCWY';
const analytics = Analytics({
  plugins: [
    doNotTrack(),
    amplitudePlugin({
      apiKey:
        process.env.REACT_APP_AMPLITUDE_API_KEY ||
        DEVELOPMENT_AMPLITUDE_API_KEY,
      // by default we will not track users, they must opt-in.
      enabled: false,
    }),
    googleAnalytics({
      measurementIds: [
        process.env.REACT_APP_GA_MEASUREMENT_ID ||
          DEVELOPMENT_GA_MEASUREMENT_ID,
      ],
      enabled: false,
      gtagConfig: {
        anonymize_ip: true,
      },
    }),
  ],
  // see here for debugging tools:
  // https://getanalytics.io/debugging/
  debug: process.env.NODE_ENV === 'development',
});

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    clientId={config.clientId}
    redirectUri={window.location.origin}
    // onRedirectCallback={onRedirectCallback}
    // returnTo={config.returnTo}
    useRefreshTokens={true}
    audience={config.audience}
    cacheLocation="localstorage"
  >
    <AuthApolloProvider>
      <QueryClientProvider client={queryClient}>
        <IntercomProvider appId={intercomId} autoBoot>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <WalletProvider>
              <LedgerProvider>
                <ThemeProvider injectFonts>
                  <AnalyticsProvider instance={analytics}>
                    <App />
                  </AnalyticsProvider>
                </ThemeProvider>
              </LedgerProvider>
            </WalletProvider>
          </LocalizationProvider>
        </IntercomProvider>
      </QueryClientProvider>
    </AuthApolloProvider>
  </Auth0Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
