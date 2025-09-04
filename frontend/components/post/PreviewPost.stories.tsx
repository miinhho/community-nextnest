import QueryProvider from '@/providers/QueryProvider';
import type { Meta, StoryObj } from '@storybook/react';
import PreviewPost, { PreviewPostSkeleton } from './PreviewPost';

const meta: Meta<typeof PreviewPost> = {
  title: 'Components/PreviewPost',
  component: PreviewPost,
  decorators: [
    (Story) => (
      <QueryProvider>
        <Story />
      </QueryProvider>
    )
  ],
};

export default meta;

type Story = StoryObj<typeof PreviewPost>;

export const Default: Story = {
  args: {
    postId: 'sample-post-id',
    onComment: () => console.log('Comment button clicked'),
  }
};

export const Loading = () => <PreviewPostSkeleton />;

