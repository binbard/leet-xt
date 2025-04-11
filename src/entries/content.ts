import App from '@/core/app';

export default defineContentScript({
  matches: ["*://leetcode.com/*"],
  async main() {
    const app = new App();
    await app.applyModules();
  },
});
