import Demo from '@/pages/Demo';
import Home from '@/pages/Home';
import Room from '@/pages/Room';
import Play01 from '@/pages/Play01';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Play01 />,
  },
  {
    path: '/demo',
    element: <Demo />,
  },
  {
    path: '/:id',
    element: <Demo />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/rooms/:id',
    element: <Room />,
  },
]);

const RootRouter = () => {
  return <RouterProvider router={router} />;
};

export default RootRouter;
