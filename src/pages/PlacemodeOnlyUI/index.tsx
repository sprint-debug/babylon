//import React from 'react';
import usePlaceMode from './usePlaceMode';
import DynamicSheet from '../_shared/Layouts/DynamicSheet';
import Header from './Header';
import Search from './Search';
import Sort from './Sort';
import Cate from './Category';
import Item from './Item';
import style from "./style.module.scss";

const PlaceMode = () => {
  const { placeMode } = usePlaceMode();

  return (
    <>
      <Header />
      <DynamicSheet isOpen={placeMode} direction='RESIZE_BOT' >
        <Search className={`${style.contentSearch} ${placeMode ? style.expanded : ''}`} />
        <Cate className={style.contentCategory} />
        <Sort className={style.contentSort} />
        <Item className={style.contentItem} />
      </DynamicSheet>
    </>
  );
};

export default PlaceMode;
