import React from 'react';
import { messageClient } from '@/clients/events';
import Button from '@/components/Button';
import { Outlet, NavLink } from 'react-router-dom';
import { logger } from '@/common/utils/logger';
import Text from '@/components/Text';
import FixedView from '../_shared/Layouts/FixedView';
import './style.scss';

const Tutorial = () => {

  const handleSceneSwitch = () => {
    // scene 전환 시 inspector 종료 통신한다.
    messageClient.postMessage('clear_inspector');
  }

  React.useEffect(() => {
    // Todo: 이벤트 리스너 클린업이 안되서 전환 시마다 증가하고 있음
    messageClient.addListener('alert', (payload: any) => {
      alert(payload.text);
    });

    return () => {
      messageClient.removeListener('alert');
      messageClient.removeListener('clear_inspector');
    };
  }, []);

  return (
    <FixedView className='container'>
      {/* Outlet is required to show nested child route */}

      <div className='menu_area'>
        <Button
          onClick={() => {
            messageClient.postMessage('clear_inspector', { 2: 2 });
          }}
        >
          <>Box</>
        </Button>
        <nav onClick={handleSceneSwitch} id='sidebar' className='sidebar'>
          <NavLink to='1' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            first example
          </NavLink>
          <NavLink to='2' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            createBuildFunction
          </NavLink>
          <NavLink to='3' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            CreateMultipleInstance
          </NavLink>
          <NavLink to='4' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            WebLayout
          </NavLink>
          <NavLink to='5' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            MeshParentDisc
          </NavLink>
          <NavLink to='6' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            MeshParentBox
          </NavLink>
          <NavLink to='7' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            Car
          </NavLink>
          <NavLink to='8' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            Dude
          </NavLink>
          <NavLink to='9' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            MovePOV
          </NavLink>
          <NavLink to='10' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            MoveChar
          </NavLink>
          <NavLink to='11' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            CollisionDetection
          </NavLink>
          <NavLink to='12' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            HeightMap
          </NavLink>
          <NavLink to='13' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            SkiesAbove
          </NavLink>
          <NavLink to='14' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            Sprites
          </NavLink>
          <NavLink to='15' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            Particle
          </NavLink>
          <NavLink to='16' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            Lamp
          </NavLink>
          <NavLink to='17' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            StreetLight&GUI
          </NavLink>
          <NavLink to='18' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            Shadow
          </NavLink>
          <NavLink to='19' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            CameraParent
          </NavLink>
          <NavLink to='20' className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""} >
            CameraController
          </NavLink>
        </nav>

      </div>
      <div className='scene_area'>
        <Outlet />
      </div>
    </FixedView>
  );
};

export default Tutorial;


// import React from 'react';
// import FixedView from '../_shared/Layouts/FixedView';

// const Play01 = () => {
//   React.useEffect(() => { }, []);

//   return <FixedView>Play01!</FixedView>;
// };

// export default Play01;
