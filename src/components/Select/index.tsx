import SelectCore, { SelectCoreProps } from '../_core/SelectCore';

export interface SelectProps extends SelectCoreProps {}

const Select = ({ ...rest }: SelectProps) => {
  return <SelectCore {...rest}></SelectCore>;
};

export default Select;
