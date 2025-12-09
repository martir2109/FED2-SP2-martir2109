import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5501,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        login: resolve(__dirname, "./auth/login/index.html"),
        register: resolve(__dirname, "./auth/register/index.html"),
        about: resolve(__dirname, "./footer-links/about/index.html"),
        privacyPolicy: resolve(
          __dirname,
          "./footer-links/privacy-policy/index.html",
        ),
        termsOfService: resolve(
          __dirname,
          "./footer-links/terms-of-service/index.html",
        ),
        createListing: resolve(__dirname, "./listing/create/index.html"),
        editListing: resolve(__dirname, "./listing/edit/index.html"),
        viewListing: resolve(__dirname, "./listing/view/index.html"),
        profile: resolve(__dirname, "./profile/index.html"),
      },
    },
  },
});
