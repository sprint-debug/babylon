import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from '@/App';
import Demo from '@/pages/Demo';
import Home from '@/pages/Home';
import Room from '@/pages/Room';
import Init from '@/pages/Init';
import TutorialMenu from '@/pages/Tutorial';
import Tutorial from '@/pages/Tutorial/TutorialScene';
import CBF from '@/pages/Tutorial/CreateBuildFunction';
import CMI from '@/pages/Tutorial/CreateMultipleInstance';
import WAL from '@/pages/Tutorial/WebLayout';
import MeshParentDisc from '@/pages/Tutorial/MeshParentDisc';
import MeshParentBox from '@/pages/Tutorial/MeshParentBox';
import Car from '@/pages/Tutorial/Car';
import Dude from '@/pages/Tutorial/Dude';
import MovePOV from '@/pages/Tutorial/MovePOV';
import MoveChar from '@/pages/Tutorial/MoveChar';
import ProtoType from '@/pages/ProtoType';
import Error from '@/pages/Error';

/** https://reactrouter.com/en/main */
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // with this data loaded before rendering
    // loader: async ({ request, params }) => {
    //   return fetch(
    //     `/fake/api/teams/${params.teamId}.json`,
    //     { signal: request.signal }
    //   );
    // },
    children: [
      {
        index: true,
        element: <Init />,
      },
      // {
      //   path: 'login',
      //   element: <Login />,
      // },
      {
        path: 'tutorial',
        element: <TutorialMenu />,
        children: [
          {
            path: '1',
            element: <Tutorial />,
            // children: []
          },
          {
            path: '2',
            element: <CBF />
          },
          {
            path: '3',
            element: <CMI />,
          },
          {
            path: '4',
            element: <WAL />,
          },
          {
            path: '5',
            element: <MeshParentDisc />,
          },
          {
            path: '6',
            element: <MeshParentBox />,
          },
          {
            path: '7',
            element: <Car />,
          },
          {
            path: '8',
            element: <Dude />,
          },
          {
            path: '9',
            element: <MovePOV />,
          },
          {
            path: '10',
            element: <MoveChar />,
          },
        ]
      },
    ],
    errorElement: <Error />,
  },
]);

const RootRouter = () => {
  return <RouterProvider router={router} />;
};

export default RootRouter;
