import Demo from '@/pages/Demo';
import Home from '@/pages/Home';
import Room from '@/pages/Room';
import Tutorial from '@/pages/Tutorial';
import ProtoType from '@/pages/ProtoType';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Tutorial />,
  },
  // {
  //   path: '/prototype',
  //   element: <ProtoType />,
  // },
  // {
  //   path: '/demo',
  //   element: <Demo />,
  // },
  // {
  //   path: '/home',
  //   element: <Home />,
  // },
  // {
  //   path: '/rooms/:id',
  //   element: <Room />,
  // },
]);

const RootRouter = () => {
  return <RouterProvider router={router} />;
};

export default RootRouter;
