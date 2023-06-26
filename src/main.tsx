import ReactDOM from 'react-dom/client';
import RootRouter from './routers';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  //StrictMode 활성화시 두번 동작으로 머테리얼이 날라감.
  <RootRouter />,
);
