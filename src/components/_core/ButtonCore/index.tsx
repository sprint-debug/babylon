import throttle from 'lodash/throttle';
import { ButtonHTMLAttributes, MouseEvent } from 'react';

export type ButtonCoreProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonCore = ({
  children,
  onClick = () => { },
  ...rest
}: ButtonCoreProps) => {

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => onClick(e);

  return (
    <button onClick={throttle(handleClick, 1000)} {...rest}>
      {children}
    </button>
  );
};

export default ButtonCore;
