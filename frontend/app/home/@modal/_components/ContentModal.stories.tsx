import { ContentModal } from "@/app/home/@modal/_components/ContentModal";
import { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof ContentModal> = {
  title: 'App/ContentModal',
  component: ContentModal,
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="dark:text-white">Modal Content</div>,
  },
}