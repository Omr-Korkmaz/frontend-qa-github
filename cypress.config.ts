import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200', // Ensure this matches your development server URL
    supportFile: false, // Optional: Only needed if you're using custom support files
  },
});
