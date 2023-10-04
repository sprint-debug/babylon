import { Textfit } from 'react-textfit';
import ButtonCore, { ButtonCoreProps } from '../../_core/ButtonCore';
import styles from './style.module.scss';
import { VariantType } from '@/common/types';
import classNames from 'classnames';
import { useMemo } from 'react';
import Icon from '@/components/Icon';

export type IconButtonProps = ButtonCoreProps & {
  shape?: 'rect' | 'capsule';
  variant?: VariantType;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'full';
  loading?: boolean;
  iconName: string;
};

const IconButton = ({
  className,
  children,
  disabled,
  loading,
  size = 's',
  shape = 'capsule',
  variant = 'tertiary',
  iconName,
  ...rest
}: IconButtonProps) => {
  const max = useMemo(() => {
    switch (size) {
      case 'full':
      case 'xl':
        return 16;
      default:
        return 12;
    }
  }, [size]);

  return (
    <ButtonCore
      className={classNames(styles['button'], className, {
        [styles['button-full']]: size === 'full',
      })}
      disabled={disabled || loading}
      {...rest}
    >
      <Textfit
        className={classNames(
          styles['container'],
          styles[variant],
          styles[size],
          styles[shape],
          { [styles['disabled']]: disabled },
        )}
        mode="single"
        max={max}
        forceSingleModeWidth={true}
      >
        <div className={styles.iconButtonWrapper}>
          <Icon name={iconName} />
          <p>{children}</p>
        </div>
      </Textfit>
    </ButtonCore>
  );
};

export default IconButton;
