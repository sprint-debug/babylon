import CustomButton from '@/components/Buttons/CustomButton';
import { ButtonCoreProps } from '@/components/_core/ButtonCore';
import { StoryFn, Meta } from '@storybook/react';

export default {
  title: 'Components/Button/CustomButton',
  component: CustomButton,
  argTypes: {
    shape: {
      default: 'capsule',
      options: ['capsule', 'rect', 'round', 'outline'],
      control: { type: 'radio' },
    },
    color: {
      default: 'primary',
      options: ['primary', 'primary01', 'primary02', 'primary03', 'primary04'],
      control: { type: 'radio' },
    },
    size: {
      default: 'medium',
      options: ['large', 'medium', 'small', 'x-small'],
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
} as Meta<typeof CustomButton>;

interface StorybookButtonProps extends ButtonCoreProps {
  text: string;
}

const Template: StoryFn<StorybookButtonProps> = (
  args: StorybookButtonProps,
) => <CustomButton {...args}>버튼</CustomButton>;

export const DefaultButton = Template.bind({});
