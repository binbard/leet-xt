import { defineConfig } from 'wxt';
import { resolve } from 'node:path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  // Relative to project root
  srcDir: "src",             // default: "."
  outDir: "dist",            // default: ".output"

  // Relative to srcDir
  entrypointsDir: "entries", // default: "entrypoints"
  modulesDir: "wxt-modules", // default: "modules"

  manifest: {
    short_name: "Leet Xt",
    name: "Leet Xt - Supercharge your Leetcode practice",
    description: "Supercharge your LeetCode practice - Add to Friends, Premium Features, per Contest Friends Rating, and more!",
    icons: {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png",
    },
    host_permissions: [
      "https://sheets.googleapis.com/*",
      "https://wandb-berm-1c80.public-antagonist-58.workers.dev/*",
    ],
    permissions: ['storage', 'downloads', 'unlimitedStorage'],
  },

  runner: {
    chromiumProfile: resolve('.wxt/chrome-data'),
    keepProfileChanges: true,
  },
})