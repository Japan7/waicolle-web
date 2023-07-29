<script setup lang="ts">
import { Chara } from "server/utils/nanapi-client";

const props = defineProps<{
  chara: Chara;
  selected: boolean;
}>();

const src = `https://s4.anilist.co/file/anilistcdn/character/medium/${props.chara.image}`;
</script>

<template>
  <img
    :class="
      'w-16 h-24 cursor-pointer object-cover' +
      (selected ? ' border-2 border-purple-400' : '')
    "
    :src="src"
    :alt="chara.id_al.toString()"
    loading="lazy"
  />
</template>
