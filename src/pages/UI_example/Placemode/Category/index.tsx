import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { currentCtgrAtom, currentCtgrKeyAtom } from '@/common/stores';
import { logger } from '@/common/utils/logger';
import Button from '@/components/Buttons/CustomButton';
import Icon from '@/components/Icon';
import style from './style.module.scss';

type CategoryProps = {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
};

const Category = ({ className }: CategoryProps): React.ReactElement => {
  const currentCtgr = useAtomValue(currentCtgrAtom);
  const [currentCtgrKey, setCurrentCtgrKey] = useAtom(currentCtgrKeyAtom);
  // const currentCtgrKey = useAtomValue(currentCtgrKeyAtom);

  const handleCategory = (ctgrKey: any) => () => {
    logger.log('handleCategory', Number(ctgrKey))
    /** TODO: 선택 된 항목 작업 */
    setCurrentCtgrKey(ctgrKey);
  }

  const CategoryList = (): React.ReactElement => {
    const data = Object.entries(currentCtgr).map((ctgr, idx) => {
      const ctgrKey = ctgr[0]
      const ctgrInfo = ctgr[1]
      const imgPath = Number(currentCtgrKey) === Number(ctgrKey) ? ctgrInfo.ActiveIcon : ctgrInfo.InActiveIcon;
      return (
        <Button onClick={handleCategory(ctgrKey)} className={style.categoryBtn} key={idx}>
          <Icon src={imgPath} />
        </Button>
      );
    });
    // @ts-ignore
    return data;
  };


  React.useEffect(() => {
  }, []);

  return (
    <div className={className}>
      <CategoryList />
    </div>
  );
};

export default Category;
