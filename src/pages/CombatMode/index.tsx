//import React from 'react';
import PlaceModeScene from '@/pages/CombatMode/PlaceModeScene';
import usePlaceMode from '@/pages/CombatMode/usePlaceMode';
import FixedView from '@/pages/_shared/Layouts/FixedView';
import DynamicSheet from '@/pages/_shared/Layouts/DynamicSheet';
import Header from '@/pages/CombatMode/Header';
import Search from '@/pages/CombatMode/Search';
import Sort from '@/pages/CombatMode/Sort';
import Cate from '@/pages/CombatMode/Category';
import Item from '@/pages/CombatMode/Item';
import style from "./style.module.scss";

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


