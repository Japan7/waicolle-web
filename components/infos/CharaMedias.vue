<script setup lang="ts">
import type { CharaData } from "utils/anilist";

const props = defineProps<{
  chara: CharaData;
  cursorPointer?: boolean;
}>();
const emit = defineEmits<{
  mediaIdSelect: [id: number];
}>();

const data = computed(() => getCharaMedias(props.chara));
</script>

<template>
  <div>
    <template v-if="data.seiyuu">
      <h2 class="my-2 font-bold">Character Voice</h2>
      <p>{{ data.seiyuu }}</p>
    </template>

    <template v-if="data.animes.length > 0">
      <h2 class="my-2 font-bold">Animeography Top 5</h2>
      <p
        v-for="a in data.animes.slice(0, 5)"
        :key="a.id"
        :class="{ 'cursor-pointer': cursorPointer }"
        @click="emit('mediaIdSelect', a.id)"
      >
        {{ a.title.romaji }}
      </p>
    </template>

    <template v-if="data.mangas.length > 0">
      <h2 class="my-2 font-bold">Mangaography Top 5</h2>
      <p
        v-for="m in data.mangas.slice(0, 5)"
        :key="m.id"
        :class="{ 'cursor-pointer': cursorPointer }"
        @click="emit('mediaIdSelect', m.id)"
      >
        {{ m.title.romaji }}
      </p>
    </template>
  </div>
</template>
