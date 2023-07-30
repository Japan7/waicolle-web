<script setup lang="ts">
useHead({
  title: "Waifu Collection",
  meta: [
    { name: "description", content: "WaiColle companion web app" },
    { name: "theme-color", content: "#956DA6" },
    { name: "og:type", content: "website" },
    { name: "og:site_name", content: "Japan7/waicolle-web" },
    {
      name: "og:image",
      content: "https://waicolle.japan7.bde.enseeiht.fr/logo512.png",
    },
  ],
  link: [
    { rel: "manifest", href: "/manifest.json" },
    { rel: "apple-touch-icon", href: "/logo192.png" },
  ],
});
</script>

<template>
  <NuxtPage />
</template>
