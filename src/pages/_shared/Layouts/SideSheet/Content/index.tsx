import Sheet from 'react-modal-sheet';

interface ContentProps {
  children: React.ReactNode;
}
const Content = ({ children }: ContentProps) => {
  return <Sheet.Content>{children}</Sheet.Content>;
};

export default Content;
