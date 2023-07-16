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
import CollisionDetection from '@/pages/Tutorial/CollisionDetection';
import HeightMap from '@/pages/Tutorial/HeightMap';
import Sky from '@/pages/Tutorial/Sky';
import Sprites from '@/pages/Tutorial/Sprites';
import Particle from '@/pages/Tutorial/Particle';
import Lamp from '@/pages/Tutorial/Lamp';
import StreetLight from '@/pages/Tutorial/StreetLight';
import Shadow from '@/pages/Tutorial/Shadow';
import CameraParent from '@/pages/Tutorial/CameraParent';
import CameraController from '@/pages/Tutorial/CameraController';
import Practice from '@/pages/Practice';
import DPF from '@/pages/Practice/DPF';
import AssetTest from '@/pages/Practice/AssetTest';
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
      { index: true, element: <Init /> },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'practice',
        element: <Practice />,
        children: [
          { path: '1', element: <DPF /> },
          { path: '2', element: <AssetTest /> },
        ]
      },
      {
        path: 'tutorial',
        element: <TutorialMenu />,
        children: [
          { path: '1', element: <Tutorial />, children: [] },
          { path: '2', element: <CBF /> },
          { path: '3', element: <CMI /> },
          { path: '4', element: <WAL /> },
          { path: '5', element: <MeshParentDisc /> },
          { path: '6', element: <MeshParentBox /> },
          { path: '7', element: <Car /> },
          { path: '8', element: <Dude /> },
          { path: '9', element: <MovePOV /> },
          { path: '10', element: <MoveChar /> },
          { path: '11', element: <CollisionDetection /> },
          { path: '12', element: <HeightMap /> },
          { path: '13', element: <Sky /> },
          { path: '14', element: <Sprites /> },
          { path: '15', element: <Particle /> },
          { path: '16', element: <Lamp /> },
          { path: '17', element: <StreetLight /> },
          { path: '18', element: <Shadow /> },
          { path: '19', element: <CameraParent /> },
          { path: '20', element: <CameraController /> },
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
