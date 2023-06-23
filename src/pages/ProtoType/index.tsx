import React from 'react';
import ProtoTypeScene from './ProtoTypeScene';
import { messageClient } from '@/clients/events';
import Button from '@/components/Button';
import FixedView from '../_shared/Layouts/FixedView';

const ProtoType = () => {
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
      <ProtoTypeScene />
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

export default ProtoType;