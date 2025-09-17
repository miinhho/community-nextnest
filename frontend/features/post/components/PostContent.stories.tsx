import QueryProvider from '@/lib/providers/QueryProvider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toaster } from 'sonner';
import PostContent, { PostContentSkeleton } from './PostContent';

const meta: Meta<typeof PostContent> = {
  title: 'Components/PostContent',
  component: PostContent,
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

type Story = StoryObj<typeof PostContent>;

export const Default: Story = {
  args: {
    postId: 'sample-post-id',
    onComment: () => console.log('Comment button clicked'),
  }
};

export const Loading = () => <PostContentSkeleton />;

