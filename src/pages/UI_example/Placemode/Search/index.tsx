import React from 'react';
import { logger } from '@/common/utils/logger';
import Button from '@/components/Buttons/CustomButton';
import Svg from '@/components/Image';
import TextInput from '@/components/TextInput';
import style from './style.module.scss';

type SortProps = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
};

const Search = ({ className }: SortProps): React.ReactElement => {
  const [searchStr, setSearchString] = React.useState('');

  const handleSearch = () => {
    logger.log('handleSearch');
  };

  const handleReset = () => {
    logger.log('handleReset');
  };

  const onSearchInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    logger.log('handleReset ', e.currentTarget.value);
    setSearchString(e.currentTarget.value);
  };

  return (
    <div className={className}>
      <div onClick={handleSearch} className={style.searchInput}>
        <Svg src={`search.svg`} />
        <TextInput
          onChange={onSearchInputChange}
          defaultValue={searchStr}
          type="text"
        />
      </div>
      <Button onClick={handleReset} className={style.resetBtn}>
        <Svg src="reset.png" />
      </Button>
    </div>
  );
};

export default Search;
