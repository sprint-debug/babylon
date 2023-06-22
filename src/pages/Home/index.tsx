import React from 'react';
import HomeScene from './HomeScene';
import { messageClient } from '@/clients/events';
import Button from '@/components/Button';
import FixedView from '../_shared/Layouts/FixedView';

const Home = () => {
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
      <HomeScene />
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

export default Home;
