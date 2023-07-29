// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/apollo"],
  runtimeConfig: {
    nanapiUrl: "",
    nanapiClientUsername: "",
    nanapiClientPassword: "",
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: "https://graphql.anilist.co",
      },
    },
  },
});
