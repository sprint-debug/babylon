import React from 'react';
import style from './style.module.scss';

type TSheetType = 'RESIZE_BOT' | 'COVER_TOP' | 'COVER_RIGHT' | 'COVER_BOT' | 'COVER_LEFT';

type DynamicSheetProps = {
  children: React.ReactNode;
  direction : TSheetType;
  isOpen : boolean;
};

/**
 * @param isOpen : 열기, 닫기 조정
 * @param direction : 시트 타입 조정
 * 
 * RESIZE_BOT : 시트 상단에서 시작, 기존 요소와 리사이징.
 * 
 * COVER_TOP : 시트 상단에서 시작, 기존 요소 덮음
 * 
 * COVER_RIGHT : 시트 우측에서 시작, 기존 요소 덮음
 * 
 * COVER_BOT : 시트 하단에서 시작, 기존 요소 덮음
 * 
 * COVER_LEFT : 시트 좌측에서 시작, 기존 요소 덮음
 * 
 * @returns 
 */
const DynamicSheet = ({ children, isOpen, direction } : DynamicSheetProps) => {
  const sheetDirection = (): string | undefined => {
    let sheetType = ''
    switch (direction) {
      case 'RESIZE_BOT':
        sheetType = `${style.container} ${isOpen ? `${style.expanded}` : ''}`;
        break;
      case 'COVER_TOP':
        sheetType = `${style.containerTop} ${isOpen ? `${style.expanded}` : ''}`;
        break;
      case 'COVER_BOT':
        sheetType = `${style.containerBottom} ${isOpen ? `${style.expanded}` : ''}`;
        break;
      case 'COVER_LEFT':
        sheetType = `${style.containerLeft} ${isOpen ? `${style.expanded}` : ''}`;
        break;
      case 'COVER_RIGHT':
        sheetType = `${style.containerRight} ${isOpen ? `${style.expanded}` : ''}`;
        break;
      default:
        sheetType = 'error'
        break;
    }
    
    return sheetType;
  };

  return (
    <div className={sheetDirection()} >
      {children}
    </div>
  );
};

export default DynamicSheet;