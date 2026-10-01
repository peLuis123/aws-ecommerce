import process from 'node:process';
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: 5000,
      strictPort: true,
      proxy: {
        "/api": {
          target:
            env.DEV_API_TARGET ||
            "https://a3fhts23f7vaw6i345hagans2q0qtcxk.lambda-url.us-east-2.on.aws",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          configure(proxy) {
            proxy.on("proxyRes", (response) => {
              const cookies = response.headers["set-cookie"];
              if (cookies)
                response.headers["set-cookie"] = cookies.map((cookie) =>
                  cookie
                    .replace(/;\s*Secure/gi, "")
                    .replace(/SameSite=None/gi, "SameSite=Lax")
                    .replace(/Path=\/auth(?=;|$)/g, "Path=/api/auth"),
                );
            });
          },
        },
      },
    },
  };
});
