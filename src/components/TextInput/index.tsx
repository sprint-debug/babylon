import InputCore, { TextInputCoreProps } from '../_core/InputCore';

export interface TextInputProps extends TextInputCoreProps {
  type: 'text' | 'number' | 'hidden';
}

const TextInput = ({ ...rest }: TextInputProps) => {
  return <InputCore {...rest}></InputCore>;
};

export default TextInput;
