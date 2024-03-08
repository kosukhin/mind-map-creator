const packageJson = require('./package.json')
const lastArg = process.argv[process.argv.length - 1]

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '@/assets/styles/variables.scss',
    '@/assets/styles/reset.scss',
    '@/assets/styles/transitions.scss',
  ],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    vueI18n: './i18n.config.ts',
  },
  runtimeConfig: {
    public: {
      version: packageJson.version,
      isDemo: lastArg === '--demo',
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/mixins.scss";',
        },
      },
    },
  },
})
