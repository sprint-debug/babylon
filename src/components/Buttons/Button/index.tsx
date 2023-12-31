import { Textfit } from 'react-textfit';
import ButtonCore, { ButtonCoreProps } from '../../_core/ButtonCore';
import styles from './styles.module.scss';
import { VariantType } from '@/common/types';
import classNames from 'classnames';
import { useMemo } from 'react';

type ButtonProps = ButtonCoreProps & {
  shape?: 'rect' | 'capsule';
  variant?: VariantType;
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'full';
  loading?: boolean;
};

const Button = ({
  className,
  children,
  disabled,
  loading,
  size = 'm',
  shape = 'capsule',
  variant = 'primary',
  ...rest
}: ButtonProps) => {
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
        forceSingleModeWidth={false}
      >
        {children}
      </Textfit>
    </ButtonCore>
  );
};

export default Button;
