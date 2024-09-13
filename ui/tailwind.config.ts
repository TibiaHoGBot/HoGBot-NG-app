/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import { join } from 'path';
import { skeleton } from '@skeletonlabs/skeleton/plugin';
import { hogTheme } from "../ui/src/lib/hog-theme";

export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(require.resolve('@skeletonlabs/skeleton-svelte'), '../**/*.{html,js,svelte,ts}')
  ],
  theme: {
    extend: {},
  },
  plugins: [
    skeleton({
      themes: [hogTheme as any]
    })
  ],
} satisfies Config

