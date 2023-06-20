import SpinnerCore, { SpinnerCoreProps } from '../_core/SpinnerCore';

export interface SpinnerProps extends SpinnerCoreProps {}

const Spinner = ({}: SpinnerProps) => {
  return <SpinnerCore />;
};

export default Spinner;
