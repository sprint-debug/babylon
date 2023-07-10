import React, { MouseEvent } from 'react';
import HomeScene from './HomeScene';
import { messageClient } from '@/clients/events';
import Button from '@/components/Button';
import Text from '@/components/Text';
import FixedView from '../_shared/Layouts/FixedView';
import style from "./style.module.scss";
import { logger } from '@/common/utils/logger';

const Home = () => {
  const [placeMode, setPlaceMode] = React.useState(false);
  const showPlaceMode = (e: MouseEvent<HTMLButtonElement>) => {
    logger.log('showPlaceMode ', e)
    setPlaceMode(!placeMode);
  }

  React.useEffect(() => {
    messageClient.addListener('alert', (payload: any) => {
      alert(payload.text);
    });

    return () => {
      messageClient.removeListener('alert');
    };
  }, []);

  return (
    <FixedView className={style.containerPlacemode}>
      <div className={placeMode ? style.expanded : style.contentContainer} />
      <div className={style.canvasContainer}>
        <HomeScene />
      </div>
      <div className={placeMode ? style.expanded : style.contentContainer} />
      <Button onClick={showPlaceMode} className={style.switchBtn}>
        <Text text='배치' />
      </Button>
      {/* <Button
          onClick={() => {
            messageClient.postMessage('box');
          }}
        >
          <>Box</>
        </Button> */}
    </FixedView>
  );
};

export default Home;
