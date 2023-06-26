import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '@/App';
import Demo from '@/pages/Demo';
import Home from '@/pages/Home';
import Room from '@/pages/Room';
import Tutorial from '@/pages/Tutorial';
import CBF from '@/pages/Tutorial/CreateBuildFunction';
import CMI from '@/pages/Tutorial/CreateMultipleInstance';
import ProtoType from '@/pages/ProtoType';
import Error from '@/pages/Error';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Tutorial />,
      },
      {
        path: 'example01',
        element: <CBF />,
      },
      {
        path: 'example02',
        element: <CMI />,
      },
      // {
      //   path: 'login',
      //   element: <Login />,
      // },
    ],
    errorElement: <Error />,
  },
]);

const RootRouter = () => {
  return <RouterProvider router={router} />;
};

export default RootRouter;
