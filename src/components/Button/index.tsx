import ButtonCore, { ButtonCoreProps } from '../_core/ButtonCore/index';

interface ButtonProps extends ButtonCoreProps {
  loading?: boolean;
}

const Button = ({
  children,
  onClick,
  className,
  disabled,
  loading,
}: ButtonProps) => {
  return (
    <ButtonCore
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {children}
    </ButtonCore>
  );
};

export default Button;
