import React from 'react';
import FixedView from '../_shared/Layouts/FixedView';
import RoomScene from './RoomScene';
// import { ACCESS_TOKEN } from '@/common/utils/auth';
import { Outlet } from 'react-router-dom';
// import AppBar from '../_shared/Appbar';
import style from "./style.module.scss";

const Room = () => {
  React.useEffect(() => {
    // console.log('_ACCESS_TOKEN', ACCESS_TOKEN);
  }, []);

  return (
    <FixedView className={style.containerPlacemode}>
      <RoomScene />
      <Outlet />
      {/* <AppBar /> */}
    </FixedView>
  );
};

export default Room;
