import React from 'react';
import { logger } from '@/common/utils/logger';
import Button from '@/components/Buttons/CustomButton';
import Icon from '@/components/Icon';
import style from './style.module.scss';

type SortProps = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
};

const Sort = ({ className }: SortProps): React.ReactElement => {
  const [sortType, setSortType] = React.useState('');

  const handleSort = (type: string) => () => {
    logger.log('handleSort ', type)
    if (sortType === type) setSortType('');
    else setSortType(type);
  }

  return (
    <div className={className}>
      <Button onClick={handleSort('FAV')} className={style.favBtn}>
        <Icon src={sortType === 'FAV' ? `heartBlack.svg` : `heart.svg`} />
      </Button>
      <Button onClick={handleSort('OWN')} className={style.ownBtn}>
        <Icon src={sortType === 'OWN' ? `heartBlack.svg` : `heart.svg`} />
      </Button>
      <Button onClick={handleSort('FREE')} className={style.freeBtn}>
        <Icon src={sortType === 'FREE' ? `heartBlack.svg` : `heart.svg`} />
      </Button>
      <Button onClick={handleSort('PAID')} className={style.paidBtn}>
        <Icon src={sortType === 'PAID' ? `heartBlack.svg` : `heart.svg`} />
      </Button>
    </div>
  );
};

export default Sort;
