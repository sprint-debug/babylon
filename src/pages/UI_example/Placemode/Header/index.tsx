import React, { MouseEvent } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { currentCtgrAtom, uiPlaceModeAtom, uiSkinModeAtom, currentCtgrKeyAtom } from '@/common/stores';
import { logger } from '@/common/utils/logger';
import { itemCategory, skinCategory } from '@/common/utils/json/useCategory';
import Button from '@/components/Buttons/CustomButton';
import Icon from '@/components/Icon';
import style from './style.module.scss';

const Header = (): React.ReactElement => {
  const [skinMode, setSkinMode] = useAtom(uiSkinModeAtom);
  const [placeMode, setPlaceMode] = useAtom(uiPlaceModeAtom);
  const setCurrentCtgr = useSetAtom(currentCtgrAtom);
  const setCurrentCtgrKey = useSetAtom(currentCtgrKeyAtom);

  const togglePlaceMode = (e: MouseEvent<HTMLButtonElement>) => {
    /** todo : 나갈 시, 카테고리 선택 사항 / 검색기록 / 소팅 초기화  */
    logger.log('showPlaceMode ', e);
    setPlaceMode(!placeMode);
  };

  const toggleCategory = () => {
    logger.log('toggleCategory ');
    setSkinMode(!skinMode);
    if (!skinMode) {
      logger.log('toggleCategory1 ');
      setCurrentCtgr(itemCategory);
      setCurrentCtgrKey(30000)

    } else {
      logger.log('toggleCategory2 ');
      setCurrentCtgr(skinCategory);
      setCurrentCtgrKey(20000)
    }
  };
  const handleClick = () => {
    logger.log('저장 or 구입 ');
  };

  const SkinMode = (): React.ReactElement => {
    return (
      <React.Fragment>

        <Button onClick={togglePlaceMode} className={style.closeBtn}>
          <Icon src={`close.svg`} />
        </Button>
        <Button onClick={toggleCategory} className={style.skinModeBtn}>
          <Icon src={`point.svg`} />
        </Button>
        <Button onClick={handleClick} className={style.saveAndPurchaseBtn}>
          <Icon src={`coin.svg`} />
        </Button>
      </React.Fragment>
    );
  };
  const DefaultMode = (): React.ReactElement => {
    return (
      <Button onClick={togglePlaceMode} className={style.placeModeBtn}>
        <Icon src={`closetNormalIcon.svg`} />
      </Button>
    );
  };

  return (
    <React.Fragment>
      {placeMode ? <SkinMode /> : <DefaultMode />}
    </React.Fragment>
  );
};

export default Header;
