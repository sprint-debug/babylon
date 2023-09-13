import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '@/App';
import Demo from '@/pages/Demo';
import Html from '@/pages/Html';
import Home from '@/pages/Home';
import Room from '@/pages/Room';
import CombatMode from '@/pages/Combatmode';
import Init from '@/pages/Init';
import TutorialMenu from '@/pages/Tutorial/Content/';
import * as Test from '@/pages/Tutorial/'
import Practice from '@/pages/Practice';
import PlaceMode from '@/pages/UI_example/Placemode';
import PlacemodeOnlyUI from '@/pages/UI_example/PlacemodeOnlyUI';
import DPF from '@/pages/Practice/DPF';
import AssetTest from '@/pages/Practice/AssetTest';
import ReactBabylonTest from '@/pages/Practice/ReactBabylonTest';
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
      { path: 'home', element: <Home /> },
      {
        path: 'sceneWithUI',
        element: <PlaceMode />
      },
      { path: 'html', element: <Html /> },
      {
        path: 'ui-example',
        // path: 'sceneSeparatedUI/:id',
        element: <Room />,
        children: [
          {
            path: 'scenemode',
            element: <PlacemodeOnlyUI />,
          }
        ]
      },
      {
        path: 'practice', element: <Practice />,
        children: [
          { path: '1', element: <DPF /> },
          { path: '2', element: <AssetTest /> },
          { path: '3', element: <ReactBabylonTest /> },
        ]
      },
      {
        path: 'tutorial', element: <TutorialMenu />,
        children: [
          { path: '1', element: <Test.Tutorial />, children: [] },
          { path: '2', element: <Test.CBF /> },
          { path: '3', element: <Test.CMI /> },
          { path: '4', element: <Test.WAL /> },
          { path: '5', element: <Test.MeshParentDisc /> },
          { path: '6', element: <Test.MeshParentBox /> },
          { path: '7', element: <Test.Car /> },
          { path: '8', element: <Test.Dude /> },
          { path: '9', element: <Test.MovePOV /> },
          { path: '10', element: <Test.MoveChar /> },
          { path: '11', element: <Test.CollisionDetection /> },
          { path: '12', element: <Test.HeightMap /> },
          { path: '13', element: <Test.Sky /> },
          { path: '14', element: <Test.Sprites /> },
          { path: '15', element: <Test.Particle /> },
          { path: '16', element: <Test.Lamp /> },
          { path: '17', element: <Test.StreetLight /> },
          { path: '18', element: <Test.Shadow /> },
          { path: '19', element: <Test.CameraParent /> },
          { path: '20', element: <Test.CameraController /> },
        ]
      },
      { path: 'combat_test', element: <CombatMode /> },
    ],
    errorElement: <Error />,
  },
]);

const RootRouter = () => {
  return <RouterProvider router={router} />;
};

export default RootRouter;
