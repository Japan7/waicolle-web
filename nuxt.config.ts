// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/apollo", "@vueuse/nuxt"],
  typescript: {
    typeCheck: true,
  },
  runtimeConfig: {
    nanapiUrl: "",
    nanapiClientUsername: "",
    nanapiClientPassword: "",
    public: {
      defaultClientId: "",
    },
  },
  app: {
    head: {
      title: "Waifu Collection",
      meta: [
        { name: "description", content: "WaiColle companion web app" },
        { name: "theme-color", content: "#956DA6" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Japan7/waicolle-web" },
        {
          property: "og:image",
          content: "https://waicolle.japan7.bde.enseeiht.fr/logo512.png",
        },
      ],
      link: [
        { rel: "manifest", href: "/manifest.json" },
        { rel: "apple-touch-icon", href: "/logo192.png" },
      ],
    },
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: "https://graphql.anilist.co",
      },
    },
  },
});
