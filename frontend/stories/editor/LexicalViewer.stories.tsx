import LexicalViewer from "@/components/editor/LexicalViewer";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof LexicalViewer> = {
  title: "Editor/LexicalViewer",
  component: LexicalViewer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    json: {
      control: "text",
      description: "에디터에 불러올 JSON 데이터",
    },
  },
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};