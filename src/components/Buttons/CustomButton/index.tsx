import ButtonCore, { ButtonCoreProps } from '../../_core/ButtonCore';

type CustomButtonProps = ButtonCoreProps & {
  loading?: boolean;
  className?: string;
};

const CustomButton = ({
  children,
  className,
  disabled,
  loading,
  ...rest
}: CustomButtonProps) => {
  return (
    <ButtonCore
      className={className}
      disabled={disabled || loading} {...rest}
    >
      {children}
    </ButtonCore>
  );
};

export default CustomButton;
