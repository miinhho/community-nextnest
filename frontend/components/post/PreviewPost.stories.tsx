import QueryProvider from '@/providers/QueryProvider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toaster } from 'sonner';
import PreviewPost, { PreviewPostSkeleton } from './PreviewPost';

const meta: Meta<typeof PreviewPost> = {
  title: 'Components/PreviewPost',
  component: PreviewPost,
  decorators: [
    (Story) => (
      <QueryProvider>
        <Story />
        <Toaster position='top-center' />
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

