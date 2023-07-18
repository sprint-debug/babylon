//import React from 'react';
import PlaceModeScene from '@/pages/Placemode/PlaceModeScene';
import usePlaceMode from './usePlaceMode';
import FixedView from '../_shared/Layouts/FixedView';
import DynamicSheet from '../_shared/Layouts/DynamicSheet';
import Header from './Header';
import Search from './Search';
import Sort from './Sort';
import Cate from './Category';
import Item from './Item';
import style from "./style.module.scss";
import { logger } from '@/common/utils/logger';

const PlaceMode = () => {
  const { placeMode } = usePlaceMode();

  return (
    <FixedView className={style.containerPlacemode}>
      <div className={style.canvasContainer}>
        <Header />
        <PlaceModeScene />
      </div>

      <DynamicSheet isOpen={placeMode} direction='RESIZE_BOT' >
        <Search className={`${style.contentSearch} ${placeMode ? style.expanded : ''}`} />
        <Cate className={style.contentCategory} />
        <Sort className={style.contentSort} />
        <Item className={style.contentItem} />
      </DynamicSheet>
      {/* <Button onClick={() => { messageClient.postMessage('box'); }}>
        <>Box</>
      </Button> */}
    </FixedView>
  );
};

export default PlaceMode;


