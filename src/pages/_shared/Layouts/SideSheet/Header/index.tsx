import Sheet from 'react-modal-sheet';

interface HeaderProps {
  children: React.ReactNode;
}
const Header = ({ children }: HeaderProps) => {
  return <Sheet.Header>{children}</Sheet.Header>;
};

export default Header;
