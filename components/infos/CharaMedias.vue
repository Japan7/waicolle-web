<script setup lang="ts">
import { CharaData } from "utils/anilist";

const props = defineProps<{
  chara: CharaData;
}>();

const { seiyuu, animes, mangas } = getCharaMedias(props.chara);
</script>

<template>
  <div>
    <template v-if="seiyuu">
      <h2 class="my-2 font-bold">Character Voice</h2>
      <p>{{ seiyuu }}</p>
    </template>

    <template v-if="animes.length > 0">
      <h2 class="my-2 font-bold">Animeography Top 5</h2>
      <p v-for="a in animes.slice(0, 5)" :key="a.id">
        {{ a.title.romaji }}
      </p>
    </template>

    <template v-if="mangas.length > 0">
      <h2 class="my-2 font-bold">Mangaography Top 5</h2>
      <p v-for="m in mangas.slice(0, 5)" :key="m.id">
        {{ m.title.romaji }}
      </p>
    </template>
  </div>
</template>
