import React from 'react';
import { useAtom } from 'jotai';
import { uiBgColorOptionAtom } from '@/common/stores';
// import { RoomManager } from '@/common/factories/room';
// import { IDataWebColors } from 'client-core/tableData/defines/System_InternalData';
import { logger } from '@/common/utils/logger';
import CustomButton from '@/components/Buttons/CustomButton';
import Icon from '@/components/Icon';
import style from './style.module.scss';

const ColorOption = (): React.ReactElement => {
  const [uiBgColorOpt, setUiBgColorOpt] = useAtom(uiBgColorOptionAtom);
  // const [myRoomBgColor, setMyRoomBgColor] = useAtom(myRoomBgColorAtom);
  // const [initialColorIdx, setInitialColorIdx] = useAtom(initialColorIdxAtom);
  const [colorIdx, setColorIdx] = React.useState<number>(0);

  type TColorData = {
    [key: number]: string
  }
  const colorData: TColorData = {
    1: "#f1dcbd",
    2: "#fec8ac",
    3: "#ffacc3",
    4: "#a8e8d7",
    5: "#abdaf2",
    6: "#7c94e8",
    7: "#d6b6f9",
    8: "#5e406c",
    9: "#303030",
    10: "#0d1a23"
  }

  React.useEffect(() => {
    // Object.values(IDataWebColors).map((color) => {
    //   if(color.hex === myRoomBgColor) {
    //     setColorIdx(color.ID);
    //     setInitialColorIdx(color.ID);
    //     return;
    //   }
    // });

    logger.log('colorData ', colorData)

  }, [])

  const handleColorSave = () => {
    logger.log('handleColorSave');
    setUiBgColorOpt(false);
  };

  const handleColorToggle = () => {
    logger.log('handleColorToggle ', uiBgColorOpt);
    if (uiBgColorOpt) {
      // setColorIdx(initialColorIdx);
    }
    setUiBgColorOpt(!uiBgColorOpt);
  };

  /** 실제 색 설정은 html canvas에 하지만, 저장 시 및 불러오기는 클라이언트 담당 */
  const handleColorSelect = (idx: number) => () => {
    logger.log('handleColorSelect ', colorData[idx]);
    setColorIdx(colorData[idx]); // UI 표시 설정
  };

  return (
    <div
      className={
        `${style.colorOptionContainer} 
        ${uiBgColorOpt ? style.expanded : ''}`
      }
    >
      <CustomButton
        onClick={handleColorToggle}
        className={style.colorOptExpandBtn}
      // size="m"
      // shape="circle"
      // variant="black"
      >
        <Icon name={`Filter_L_On`} />
      </CustomButton>
      <div className={style.colorOptionListContainer}>
        <div className={style.colorOptionList}>
          {Object.entries(colorData).map((el) =>
            <CustomButton
              onClick={handleColorSelect(el[0])}
              className={style.colorOptBtn}
              style={{ backgroundColor: el[1] }}
              key={el[0]}
            // shape="circle"
            // variant="none"
            // size="m"
            >
              {colorIdx === Number(el[0]) && <Icon name={`Btn_Check_SS`} />}
            </CustomButton>
          )}
        </div>
      </div>
      <CustomButton
        onClick={handleColorSave}
        className={style.colorOptSaveBtn}
      // size="m"
      // shape="circle"
      >
        <Icon name={`Check_Ring_L`} />
      </CustomButton>
    </div>
  )
}

export default ColorOption;