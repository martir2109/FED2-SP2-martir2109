import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5501,
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        login: "./auth/login/index.html",
        register: "./auth/register/index.html",
        about: "./footer-links/about/index.html",
        privacyPolicy: "./footer-links/privacy-policy/index.html",
        termsOfService: "./footer-links/terms-of-service/index.html",
        createListing: "./listing/create/index.html",
        editListing: "./listing/edit/index.html",
        viewListing: "./listing/view/index.html",
        profile: "./profile/index.html",
      },
    },
  },
});
