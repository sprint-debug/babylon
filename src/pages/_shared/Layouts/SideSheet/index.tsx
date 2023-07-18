import React from 'react';
import Sheet from 'react-modal-sheet';
import Container from './Container';
import Header from './Header';
import Content from './Content';

type SideSheetProps = {
  children: React.ReactNode;
  dimmed?: boolean;
  disableDrag?: boolean;
};

//TODO: 추후 세로에서는 바텀시트가 가로에서는 사이트시트가 나오게끔 변경 예정
const SideSheet = ({ children, dimmed, ...rest }: SideSheetProps) => {
  return (
    <Sheet isOpen={true} onClose={() => {}} {...rest}>
      <React.Fragment>
        {children}
        {dimmed && <Sheet.Backdrop />}
      </React.Fragment>
    </Sheet>
  );
};

SideSheet.Container = Container;
SideSheet.Header = Header;
SideSheet.Content = Content;

export default SideSheet;
