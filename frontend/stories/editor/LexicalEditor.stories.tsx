import LexicalEditor from "@/components/editor/LexicalEditor";
import { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";

const meta: Meta<typeof LexicalEditor> = {
  title: "Editor/LexicalEditor",
  component: LexicalEditor,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    json: {
      control: "text",
      description: "에디터에 불러올 JSON 데이터",
    },
    title: {
      control: "text",
      description: "저장 버튼에 표시할 텍스트",
    },
  },
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '게시하기',
    mutateFn: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('editor-save-button');
    await userEvent.click(button);

    // editor-save-button 클릭 시 mutateFn이 호출되었는지 확인
    expect(args.mutateFn).toBeCalled();
  },
};