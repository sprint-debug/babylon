import { MouseEvent } from 'react';
import ButtonCore from '../../_core/ButtonCore';
import styles from './styles.module.scss';

type ButtonProps = {
  className?: string;
  children: React.ReactNode;
  shape?: 'rect' | 'capsule' | 'round' | 'circle';
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  loading?: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

const Button = ({
  className,
  children,
  disabled,
  loading,
  shape = 'capsule',
  variant = 'primary',
  ...rest
}: ButtonProps) => {
  return (
    <ButtonCore
      className={`${styles[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {children}
    </ButtonCore>
  );
};

export default Button;
