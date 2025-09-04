import LikeButton from '@/components/button/LikeButton';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fireEvent, waitFor, within } from '@storybook/test';

const meta: Meta<typeof LikeButton> = {
  title: 'Button/LikeButton',
  component: LikeButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onClick: {
      action: 'clicked',
    },
    className: {
      control: 'text',
      description: '추가적인 Tailwind CSS 클래스',
    },
  },
  tags: ['autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('like-button');
    const path = canvas.getByTestId('like-icon');

    // 초기 상태 확인: 좋아요가 눌리지 않은 상태
    expect(path).toHaveAttribute('fill', 'transparent');
    expect(path).toHaveAttribute('stroke-width', '2');

    // 첫 번째 클릭: 좋아요 눌림
    await fireEvent.click(button);
    await waitFor(() => {
      expect(path).toHaveAttribute('fill', 'red');
      expect(path).toHaveAttribute('stroke-width', '0');
    });

    // 두 번째 클릭: 좋아요 해제
    await fireEvent.click(button);
    await waitFor(() => {
      expect(path).toHaveAttribute('fill', 'transparent');
      expect(path).toHaveAttribute('stroke-width', '2');
    });
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClick: () => console.log('Like button clicked'),
  },
}

export const WithCustomClass: Story = {
  args: {
    className: 'bg-blue-500 text-white hover:bg-blue-600',
    onClick: () => console.log('Custom class like button clicked'),
  },
}
