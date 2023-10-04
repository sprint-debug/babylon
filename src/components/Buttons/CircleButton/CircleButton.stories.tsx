import { StoryFn, Meta } from '@storybook/react';
import CircleButton, { CircleButtonProps } from '.';
import Icon from '@/components/Icon';

export default {
  title: 'Components/Button/CircleButton',
  component: CircleButton,
  argTypes: {
    variant: {
      defaultValue: 'primary',
      control: {
        type: 'radio',
        options: ['primary', 'secondary', 'tertiary', 'black', 'none'],
      },
    },
    shape: {
      defaultValue: 'circle',
      control: {
        type: 'radio',
        options: ['circle', 'circle-bl', 'circle-br', 'none'],
      },
    },
    size: {
      defaultValue: 'm',
      control: {
        type: 'radio',
        options: ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'],
      },
    },
    badge: {
      control: {
        type: 'select',
        options: ['primary', 'secondary'],
      },
    },
    loading: {
      control: 'boolean',
    },
    iconName: {
      defaultValue: 'Close_Bottom_S',
      type: 'string',
    },
    className: { type: 'string' },
    onClick: { action: 'clicked' },
  },
} as Meta<typeof CircleButton>;
interface StorybookCircleButtonProps extends CircleButtonProps {
  iconName: string;
}

const Template: StoryFn<StorybookCircleButtonProps> = (
  args: StorybookCircleButtonProps,
) => (
  <CircleButton {...args}>
    <Icon name={args.iconName} />
  </CircleButton>
);

export const DefaultButton = Template.bind({});
DefaultButton.args = {
  variant: 'primary',
  shape: 'circle',
  size: 'm',
  badge: 'primary',
  loading: false,
  iconName: 'Close_Bottom_S',
};
