import { StoryFn, Meta } from '@storybook/react';
import IconButton, { IconButtonProps } from '.';

export default {
  title: 'Components/Button/IconButton',
  component: IconButton,
  argTypes: {
    shape: {
      options: ['rect', 'capsule'],
      control: { type: 'radio' },
    },
    variant: {
      options: ['primary', 'secondary', 'tertiary', 'none'],
      control: { type: 'radio' },
    },
    size: {
      options: ['xs', 's', 'm', 'l', 'xl', 'full'],
      control: { type: 'radio' },
    },
    disabled: {
      type: 'boolean',
    },
    loading: {
      type: 'boolean',
    },
    text: {
      type: 'string',
    },
    className: { type: 'string' },
    onClick: { action: 'clicked' },
  },
} as Meta<typeof IconButton>;

interface StorybookButtonProps extends IconButtonProps {
  text: string;
}

const Template: StoryFn<StorybookButtonProps> = (
  args: StorybookButtonProps,
) => <IconButton {...args}>{args.text}</IconButton>;

export const IconButtonStorybook = Template.bind({});
IconButtonStorybook.args = {
  iconName: 'Myroom_S',
  size: 's',
  shape: 'capsule',
  variant: 'tertiary',
  text: '아이콘',
};
