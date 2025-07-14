import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  console.log("Loaded environment variables:", env.VITE_API_BASE_URL);

  return {
    plugins: [react()],
    server: {
      host: true,
      port: parseInt(env.VITE_PORT ?? "5173"),
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        "/func1": {
          target: env.FUNC1_URL,
          changeOrigin: true,
          secure: true,
        },
        "/func2": {
          target: env.FUNC2_URL,
          changeOrigin: true,
          secure: true,
          // configure: (proxy, options) => {
          //   proxy.on("proxyReq", (proxyReq, req, res) => {
          //     console.log(
          //       "Sending Request:",
          //       req.method,
          //       req.url,
          //       " => TO THE TARGET => ",
          //       options.target
          //     );
          //   });
          // },
        },
      },
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        input: "./index.html",
      },
    },
  };
});
