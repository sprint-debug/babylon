import Sheet from 'react-modal-sheet';

interface ContainerProps {
  children: React.ReactNode | React.ReactNode[];
}
const Container = ({ children }: ContainerProps) => {
  return <Sheet.Container>{children}</Sheet.Container>;
};

export default Container;
