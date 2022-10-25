import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    publicRuntimeConfig:{
      WEATHER_APP_SECRET: process.env.WEATHER_APP_SECRET,
    },
    privateRuntimeConfig:{
     
    },

    modules: ['@nuxtjs/tailwindcss'],
    tailwindcss: {
        cssPath: '~/assets/css/tailwind.css',
        configPath: 'tailwind.config.js',
        viewer: false,
      }
})
