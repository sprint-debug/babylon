import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
//import { useAtom } from 'jotai';
import {
  currentCtgrAtom,
  currentCtgrKeyAtom,
  uiPlaceModeAtom
} from '@/common/stores';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';
// import useItemCtgrJson from '@/common/utils/json/useItemCtgrJson';
import { itemCategory } from '@/common/utils/json/useCategory';

const usePlaceMode = () => {
  const placeMode = useAtomValue(uiPlaceModeAtom);
  const setCurrentCtgr = useSetAtom(currentCtgrAtom); // 현재 적용 카테고리
  const setCurrentCtgrKey = useSetAtom(currentCtgrKeyAtom);

  React.useEffect(() => {
    logger.log('PlaceMode Page loaded');
    messageClient.addListener('alert', (payload: any) => {
      alert(payload.text);
    });

    logger.log('setCtgr ', itemCategory);
    setCurrentCtgr(itemCategory);
    setCurrentCtgrKey(30000);

    return () => {
      messageClient.removeListener('alert');
    };
  }, []);


  return {
    placeMode
  }
};

export default usePlaceMode;