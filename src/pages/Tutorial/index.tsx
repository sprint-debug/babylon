import React from 'react';
import { messageClient } from '@/clients/events';
import Button from '@/components/Button';
import Text from '@/components/Text';
import FixedView from '../_shared/Layouts/FixedView';
import { Outlet, NavLink } from 'react-router-dom';
import './style.scss';

const Tutorial = () => {

  const cleanUpInspector = () => {
    messageClient.postMessage('exitInspector');
  }

  React.useEffect(() => {
    messageClient.addListener('alert', (payload: any) => {
      alert(payload.text);
    });
    messageClient.addListener('exitInspector', (payload: any) => {
      // alert(payload);
      console.log('TEST')
    });

    return () => {
      messageClient.removeListener('alert');
    };
  }, []);

  return (
    <FixedView className='container'>
      {/* Outlet is required to show nested child route */}

      <div className='menu_area'>
        <Button
          onClick={() => {
            messageClient.postMessage('exitInspector', { 2: 2 });
          }}
        >
          <>Box</>
        </Button>
        <nav id='sidebar' className='sidebar'>
          <NavLink
            to='1'
            onClick={cleanUpInspector}
            className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}
          >
            first example
          </NavLink>
          <NavLink
            to='2'
            onClick={cleanUpInspector}
            className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}
          >
            createBuildFunction
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
