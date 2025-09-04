import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from '@storybook/nextjs-vite';
import '../app/globals.css';
import { ThemeProvider } from '../providers/ThemeProvider';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <Story />
      </ThemeProvider>
    )]
}

export default preview
