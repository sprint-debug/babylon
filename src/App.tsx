import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import localeKO from '@/common/locale/ko.json';
import { getBrowserLanguage } from '@/common/utils/getBrowserLanguage';

const queryClient = new QueryClient();

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: localeKO,
    },
    ko: {
      translation: localeKO,
    },
    jp: {
      translation: localeKO,
    },
  },
  lng: getBrowserLanguage(),
  fallbackLng: 'jp',
  ns: ['translation'],
  debug: true,
});

const App = () => {
  console.log('APP.tsx loaded');
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
