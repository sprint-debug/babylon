import useBottomSheet from './useBottomSheet';
import styled from 'styled-components';
import styles from './styles.module.scss';
import Sheet from 'react-modal-sheet';

const CustomSheet = styled(Sheet)`
  .react-modal-sheet-backdrop {
    background-color: rgba(0, 0, 0, 0) !important;
    z-index: 0 !important;
  }
  .react-modal-sheet-container {
    // background-color: rgba(0,0,0,0) !important;
  }
  .react-modal-sheet-header {
  }
  .react-modal-sheet-drag-indicator {
  }
  .react-modal-sheet-content {
    overflow: hidden !important;
    touch-action: pan-y !important;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  #avt_bottom_sheet {
    z-index: 50 !important;
  }
  #avt_bottom_sheet_container {
    /* box-shadow: rgb(0 0 0 / 15%) 0px -2px 8px !important; */
    box-shadow: 0px -10px 20px rgba(0, 0, 0, 0.02) !important;
    // background: none !important;

    &.cody_container {
      height: 186px !important;
    }

    &.offset_container {
      height: 50vh !important;
      transform: none !important;
    }
  }
  .transparent_sheet {
    background: none !important;
    box-shadow: none !important;
  }
  .visible_sheet {
    // background: none !important;
  }
`;

const BottomSheet = () => {
  const {
    bottomRef,
    isOpen,
    // handleBottomClose,
    uiHeightControlLock,
    bottomHeight,
    bottomContainerRef,
    handleCloseSheet,
    // handleStartScreenRatio,
    // handleShiftScreenRatio,
    // handleEndScreenRatio,
  } = useBottomSheet();

  // 더 가볍게 만들 수 있는지 앱테스트 필요
  const springConfig = {
    damping: 30,
    mass: 0.1,
    stiffness: 700,
    velocity: 3,
  };
  /** 스크롤 이외 시트 터치이벤트 방지 */
  //   const preventPropagation = (e: PointerEvent) => e.stopPropagation();
  return (
    <CustomSheet
      id="avt_bottom_sheet"
      ref={bottomRef}
      isOpen={isOpen}
      className={`${styles.bottom_container}`}
      style={{ zIndex: 4 }}
      onClose={() => {
        handleCloseSheet(1);
      }}
      disableDrag={uiHeightControlLock}
      initialSnap={0}
      snapPoints={[bottomHeight, 30]} // TODO: 180은 키조절 ui 바텀시트의 기본 높이, 변수로 저장할 수 있으면 빼서 관리하기
      springConfig={springConfig}
      data-status="ITEMLIST"
    >
      <CustomSheet.Container ref={bottomContainerRef}>
        <CustomSheet.Header></CustomSheet.Header>
        <CustomSheet.Content
        // style={{ paddingBottom: bottomRef.current?.y }}
        ></CustomSheet.Content>
      </CustomSheet.Container>
    </CustomSheet>
  );
};

export default BottomSheet;
