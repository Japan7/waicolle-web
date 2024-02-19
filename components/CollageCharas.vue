<script setup lang="ts">
import type { Chara } from "~/server/utils/nanapi-client";

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
      v-for="i in Math.min(limit, sortedCharas.length)"
      :key="sortedCharas[i - 1].id_al"
      :chara="sortedCharas[i - 1]"
      :selected="sortedCharas[i - 1].id_al === selected"
      @click="emit('select', sortedCharas[i - 1].id_al)"
    />
  </div>
</template>
