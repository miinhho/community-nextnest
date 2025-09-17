import ThemeButton from '@/shared/button/ThemeButton'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta: Meta<typeof ThemeButton> = {
  title: 'Button/ThemeButton',
  component: ThemeButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}