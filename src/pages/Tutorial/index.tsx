import React from 'react';
import TutorialScene from './TutorialScene';
import { messageClient } from '@/clients/events';
import Button from '@/components/Button';
import FixedView from '../_shared/Layouts/FixedView';

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
    <FixedView>
      <TutorialScene />
      <Button
        onClick={() => {
          messageClient.postMessage('box');
        }}
      >
        <>Box</>
      </Button>
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
