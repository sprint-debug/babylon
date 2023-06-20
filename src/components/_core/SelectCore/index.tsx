import { ChangeEvent } from 'react';

type SelectItem = {
  children: React.ReactNode | string;
  value: string;
};

export interface SelectCoreProps {
  className?: string;
  items?: SelectItem[];
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectCore = ({
  className,
  items,
  disabled = false,
  onChange,
}: SelectCoreProps) => {
  return (
    <select
      className={className}
      disabled={disabled}
      onChange={(e) => onChange(e)}
    >
      {items?.map((item) => (
        <option value={item.value}>{item.children}</option>
      ))}
    </select>
  );
};

export default SelectCore;
