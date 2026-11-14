<script setup lang="ts">
import type { CharaData } from "~/utils/anilist";

const props = defineProps<{
  chara: CharaData;
}>();
</script>

<template>
  <NuxtLink
    :to="chara.siteUrl"
    target="_blank"
    rel="noreferrer"
    class="block mx-auto my-4 w-2/3 object-contain cursor-pointer"
  >
    <img
      :src="chara.image.large ?? ''"
      :alt="chara.name.userPreferred"
      loading="lazy"
    />
  </NuxtLink>
</template>
