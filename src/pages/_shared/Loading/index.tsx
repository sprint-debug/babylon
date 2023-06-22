import Spinner from '@/components/Spinner';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

type LoadingProps = {
  isOpen: boolean;
};

const Loading = ({ isOpen }: LoadingProps) => {
  return (
    <Modal
      isOpen={isOpen}
      style={customStyles}
      contentLabel="Example Modal"
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <Spinner />
    </Modal>
  );
};

export default Loading;
