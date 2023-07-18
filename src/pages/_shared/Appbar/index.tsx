import React from 'react';
import styles from './styles.module.scss';
import Badge from '@/components/Badge';
import CustomButton from '@/components/Buttons/CustomButton';

const AppBar = () => {
  return (
    <ul className={styles['appbar-wrap']}>
      <li>
        <CustomButton>
          <div>
            {/* <Image /> */}
            <Badge />
          </div>
          <div>{/* <Text /> */}</div>
        </CustomButton>
      </li>
    </ul>
  );
};

export default AppBar;
