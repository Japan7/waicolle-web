<script setup lang="ts">
import { CollageFilters } from "utils/waicolle";

const props = defineProps<{
  filters: CollageFilters;
  mediaCharas?: number[];
}>();
const emit = defineEmits<{
  setFilters: [filters: CollageFilters];
  setMediaCharas: [charas?: number[]];
}>();

const div = ref<Element>();
</script>

<template>
  <div className="flex flex-col items-center gap-y-2">
    <FiltersBaseSelect
      :filters="filters"
      @setFilters="(f) => $emit('setFilters', f)"
    />
    <FiltersPlayersSelect
      :filters="filters"
      @setFilters="(f) => $emit('setFilters', f)"
    />
    <FiltersMediaSelect
      :filters="filters"
      :mediaCharas="mediaCharas"
      :div="div"
      @setFilters="(f) => $emit('setFilters', f)"
      @setMediaCharas="(mc) => $emit('setMediaCharas', mc)"
    />
    <div :ref="(e) => (div = e as Element)" className="text-center"></div>
  </div>
</template>
