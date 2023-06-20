import React from 'react';
import ReactDOM from 'react-dom/client';
import RootRouter from '@/routers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import GlobalStyles from '@/common/styles/GlobalStyles';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const queryClient = new QueryClient();

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'ko',
    fallbackLng: 'ko',
    ns: ['translation'],
    backend: {
      loadPath: 'https://yourbackenddomain/locales/{{lng}}.json',
    },
    debug: true,
  });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <RootRouter />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
