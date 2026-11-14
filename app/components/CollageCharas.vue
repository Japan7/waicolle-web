<script setup lang="ts">
import type { Chara } from "~~/server/utils/nanapi-client";

const props = defineProps<{
  charas: Chara[];
  selected?: number;
  scrollDiv?: HTMLDivElement;
}>();
const emit = defineEmits<{
  select: [id: number];
}>();

const sortedCharas = computed(() =>
  props.charas.toSorted(compareCharaFavourites)
);
const limit = useCollageInfiniteScroll(sortedCharas, toRef(props, "scrollDiv"));
useCollageHotkeys(
  computed(() => sortedCharas.value.map((c) => c.id_al)),
  toRef(props, "selected"),
  (id) => emit("select", id),
  toRef(props, "scrollDiv")
);
</script>

<template>
  <div class="flex flex-wrap justify-center">
    <CollageImage
      v-for="chara in sortedCharas.slice(0, limit)"
      :key="chara.id_al"
      :chara="chara"
      :selected="chara.id_al === selected"
      @click="emit('select', chara.id_al)"
    />
  </div>
</template>
