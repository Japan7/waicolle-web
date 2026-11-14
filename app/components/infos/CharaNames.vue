<script setup lang="ts">
import type { CharaData } from "~/utils/anilist";

const props = defineProps<{
  chara: CharaData;
}>();
</script>

<template>
  <div class="flex flex-col m-auto">
    <h1 class="m-auto font-bold">
      {{ chara.name.userPreferred }}
    </h1>
    <h2 class="m-auto font-bold">{{ chara.name.native }}</h2>
  </div>
</template>
