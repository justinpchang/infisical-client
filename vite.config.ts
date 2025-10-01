import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      "process.env.INFISICAL_UNIVERSAL_AUTH_CLIENT_ID": JSON.stringify(
        env.INFISICAL_UNIVERSAL_AUTH_CLIENT_ID
      ),
      "process.env.INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET": JSON.stringify(
        env.INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET
      ),
      "process.env.INFISICAL_PROJECT_ID": JSON.stringify(
        env.INFISICAL_PROJECT_ID
      ),
      "process.env.INFISICAL_ENV_SLUG": JSON.stringify(env.INFISICAL_ENV_SLUG),
    },
    server: {
      port: 8394,
      proxy: {
        "/api": {
          target: "https://us.infisical.com",
          changeOrigin: true,
          secure: true,
        },
        "/api-app": {
          target: "https://app.infisical.com",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api-app/, "/api"),
        },
      },
    },
  };
});
