<script setup lang="ts">
import { Chara } from "server/utils/nanapi-client";

const props = defineProps<{
  charas: Chara[];
  selected?: number;
}>();
const emit = defineEmits<{
  select: [id_al: number];
}>();

const sortedCharas = computed(() => props.charas.sort(compareCharaFavourites));
</script>

<template>
  <div class="flex flex-wrap justify-center">
    <CollageImage
      v-for="chara in sortedCharas"
      :key="chara.id_al"
      :chara="chara"
      :selected="chara.id_al === selected"
      @click="$emit('select', chara.id_al)"
    />
  </div>
</template>
