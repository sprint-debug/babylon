import React from 'react';
import { messageClient } from '@/clients/events';
import Button from '@/components/Button';
import Text from '@/components/Text';
import FixedView from '../_shared/Layouts/FixedView';
import { Outlet, Link } from 'react-router-dom';
import './style.scss';

const Tutorial = () => {
  React.useEffect(() => {
    messageClient.addListener('alert', (payload: any) => {
      alert(payload.text);
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
            messageClient.postMessage('box');
          }}
        >
          <>Box</>
        </Button>
        <Link to='../1' relative='path'>111</Link>

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
