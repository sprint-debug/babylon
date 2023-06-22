import { useEffect, useRef } from 'react';
import { SheetRef } from 'react-modal-sheet';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  avatarUiAtom,
  bottomHeightAtom,
  bottomRefAtom,
  screenRatioAtom,
  uiHeightControlLockAtom,
} from '@/common/stores/index';

const useBottomSheet = () => {
  const bottomRef = useRef<SheetRef | null>(null);
  const bottomContainerRef = useRef<HTMLDivElement | null>(null);
  const setBottomRefA = useSetAtom(bottomRefAtom);
  const [screenRatio, setScreenRatio] = useAtom(screenRatioAtom);
  const uiHeightControlLock = useAtomValue(uiHeightControlLockAtom); // 20230302 변경 된 키조절 ui 활성화여부
  const [bottomHeight, setBottomHeight] = useAtom(bottomHeightAtom);
  //   const activeMainCtgr = useAtomValue(uiActiveMainCtgrIconAtom);
  const [uiMode, setUiMode] = useAtom(avatarUiAtom); // ui Mode 설정
  const isOpen = uiMode === 'NONE' ? false : true;
  const regex = /\((.*?)\)/;

  const getHeight = () => {
    if (!bottomContainerRef.current) return window.innerHeight / 2;
    const maxHeight = bottomContainerRef.current.offsetHeight;
    const match = regex.exec(bottomContainerRef.current.style.transform);
    const transY = match ? match[1].replaceAll('px', '') : 0;

    return Math.max(maxHeight - Number(transY), 0);
  };

  /** 바텀시트 높이 조절 시작 */
  const handleStartScreenRatio = () => {
    screenRatio.toFixed(3);
  };

  /** 바텀시트 높이 조절 중 */
  const handleShiftScreenRatio = () => {
    if (uiHeightControlLock) return; // 키 조절 옵션 진입 시 스크롤변경 방지

    const h = getHeight();
    const ratio = h / window.innerHeight;

    setScreenRatio(ratio * 2); // 이 위치에서 작동 중요, BODY, BEAUTY 일 시에도 기억필요함
    setBottomHeight(h);

    // if (activeMainCtgr === 'BODY' || activeMainCtgr === 'BEAUTY') return;
    // sendShiftScreenRatio((ratio * 2).toFixed(3));
  };

  /** 바텀시트 높이 조절 종료 */
  const handleEndScreenRatio = () => {
    if (uiHeightControlLock) return;
    // if (bottomHeight < 140) handleBottomClose(); // FIXME: 해당 코드로 bottomSheet를 종료 시 아이템리스트 ui가 남아있는 버그 발생
    screenRatio.toFixed(3);
  };

  const handleBottomClose = () => {
    console.log('닫힘');
    setUiMode('ITEMLIST');
  };
  const handleCloseSheet = (num: number) => {
    bottomRef.current?.snapTo(num);
  };
  useEffect(() => {
    setBottomRefA(bottomRef);
  }, []);

  return {
    bottomRef,
    bottomContainerRef,
    uiHeightControlLock,
    bottomHeight,
    isOpen,
    handleStartScreenRatio,
    handleShiftScreenRatio,
    handleEndScreenRatio,
    handleBottomClose,
    handleCloseSheet,
  };
};

export default useBottomSheet;
