import ButtonCore, { ButtonCoreProps } from '@/components/_core/ButtonCore';
import classNames from 'classnames';
import styles from './styles.module.scss';

export type CircleButtonProps = ButtonCoreProps & {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'black' | 'none';
  shape?: 'circle' | 'circle-bl' | 'circle-br' | 'none';
  size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  badge?: 'primary' | 'secondary';
  loading?: boolean;
};

const CircleButton = ({
  children,
  shape = 'circle',
  variant = 'none',
  size,
  badge,
  style,
  ...rest
}: CircleButtonProps) => {
  return (
    <ButtonCore {...rest}>
      <div
        style={style}
        className={classNames(styles['wrap'], styles[size], {
          [styles[shape]]: shape !== 'none',
          [styles[variant]]: variant !== 'none',
        })}
      >
        {badge && (
          <div className={classNames(styles['badge'], styles[badge])}></div>
        )}
        {children}
      </div>
    </ButtonCore>
  );
};

export default CircleButton;
