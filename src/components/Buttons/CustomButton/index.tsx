import ButtonCore, { ButtonCoreProps } from '../../_core/ButtonCore';

type CustomButtonProps = ButtonCoreProps;

const CustomButton = ({ ...rest }: CustomButtonProps) => {
  return <ButtonCore {...rest} />;
};

export default CustomButton;
