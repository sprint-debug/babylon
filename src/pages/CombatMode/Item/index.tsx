import React from 'react';
import { useAtom } from 'jotai';
import { selectedItemAtom } from '@/common/stores';
import { logger } from '@/common/utils/logger';
import { itemList } from './mockItemList';
import Button from '@/components/Buttons/CustomButton';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import style from './style.module.scss';

type ListProps = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
}

const Item = ({ className }: ListProps): React.ReactElement => {
  const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom);

  const handleItem = (id: string) => () => {
    logger.log('handleItem', id);
    setSelectedItem(id);
  }

  const ItemList = (): React.ReactElement => (
    <>
      {itemList.map((item, idx) => {
        return (
          <li className={`${style.item_li} ${selectedItem === item.id ? style.selected : ''}`} key={idx}>
            <Button onClick={handleItem(item.id)} >
              <Icon src={item.assetPath} color={'Black'} />
              <Text text='Item' />
            </Button>
          </li>
        )
      })}
    </>
  );

  return (
    <div className={className}>
      <ul className={style.item_ul}>
        <ItemList />
      </ul>
    </div>
  )
}

export default Item;
