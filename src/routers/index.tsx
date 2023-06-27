import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '@/App';
import Demo from '@/pages/Demo';
import Home from '@/pages/Home';
import Room from '@/pages/Room';
import Tutorial from '@/pages/Tutorial';
import CBF from '@/pages/Tutorial/CreateBuildFunction';
import CMI from '@/pages/Tutorial/CreateMultipleInstance';
import WAL from '@/pages/Tutorial/WebLayout';
import MeshParentDisc from '@/pages/Tutorial/MeshParentDisc';
import MeshParentBox from '@/pages/Tutorial/MeshParentBox';
import Car from '@/pages/Tutorial/Car';
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
        path: 'ex01',
        element: <CBF />,
        // children: []
      },
      {
        path: 'ex02',
        element: <CMI />,
      },
      {
        path: 'ex03',
        element: <WAL />,
      },
      {
        path: 'ex04',
        element: <MeshParentDisc />,
      },
      {
        path: 'ex05',
        element: <MeshParentBox />,
      },
      {
        path: 'ex06',
        element: <Car />,
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
