import { InputHTMLAttributes } from 'react';

export type TextInputCoreProps = InputHTMLAttributes<HTMLInputElement>;

const InputCore = ({ ...rest }: TextInputCoreProps) => {
  return <input {...rest} />;
};

export default InputCore;
