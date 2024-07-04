const { defineConfig } = require("@vue/cli-service");

const isDev = process.env.NODE_ENV === "development";

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: "source-map",
    devServer: {
      allowedHosts: [".replit.dev"],
    },
  },
  pwa: {
    manifestOptions: {
      theme_color: "#838282",
      background_color: "#fcf8f5",
      display: "standalone",
      scope: "/",
      start_url: "/",
      name: isDev ? "Dev MMC" : "MMC",
      short_name: "MMC",
      description: isDev ? "Development" : "Mind Map Creator",
      file_handlers: [
        {
          action: "/",
          accept: {
            "text/json": [".json"],
          },
          launch_type: "single-client",
        },
      ],
      icons: [
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icon-256x256.png",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "/icon-384x384.png",
          sizes: "384x384",
          type: "image/png",
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },
});
