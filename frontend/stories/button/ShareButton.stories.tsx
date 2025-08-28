import ShareButton from '@/components/button/ShareButton'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ShareButton> = {
  title: 'Button/ShareButton',
  component: ShareButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
    },
    className: {
      control: 'text',
      description: '추가적인 Tailwind CSS 클래스',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClick: () => console.log('Share button clicked'),
  },
}

export const WithCustomClass: Story = {
  args: {
    className: 'bg-blue-500 text-white hover:bg-blue-600',
    onClick: () => console.log('Custom class share button clicked'),
  },
}
