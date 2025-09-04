import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from '@storybook/nextjs-vite';
import { http, HttpResponse } from "msw";
import { initialize, mswLoader } from 'msw-storybook-addon';
import '../app/globals.css';
import { ThemeProvider } from '../providers/ThemeProvider';

const worker = initialize()

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
    )],
  loaders: [mswLoader],
  beforeEach: () => {
    worker.use(
      http.get('http://localhost:6006/api/post/sample-post-id', () => {
        const data = {
          author: {
            name: 'John Doe',
            image: null,
          },
          content: "",
        };
        return HttpResponse.json(data);
      }
      ),
      http.post('http://localhost:6006/api/post/sample-post-id/like', () => {
        const data = {
          id: 'like-id',
          status: "PLUS",
        };
        return HttpResponse.json(data);
      })
    )
  }
}

export default preview