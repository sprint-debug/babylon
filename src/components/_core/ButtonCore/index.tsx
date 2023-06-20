import throttle from 'lodash/throttle';
import { PropsWithChildren } from 'react';

export interface ButtonCoreProps {
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode | React.ReactNode[];
}

const ButtonCore: React.FC<PropsWithChildren<ButtonCoreProps>> = ({
  className,
  disabled,
  onClick,
  children,
}: ButtonCoreProps) => {
  return (
    <button className={className} onClick={throttle(onClick, 1000)} disabled={disabled}>
      {children}
    </button>
  );
};

export default ButtonCore;
