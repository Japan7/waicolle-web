<script setup lang="ts">
import { CollageFilters } from "utils/waicolle";

const props = defineProps<{
  filters: CollageFilters;
  mediaCharas?: number[];
}>();
const emit = defineEmits<{
  setFilters: [filters: CollageFilters];
  setMediaCharas: [charas: number[] | undefined];
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-y-2">
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
      :infosDiv="($refs.infosDiv as HTMLDivElement | undefined)"
      @setFilters="(f) => $emit('setFilters', f)"
      @setMediaCharas="(mc) => $emit('setMediaCharas', mc)"
    />
    <div ref="infosDiv" class="text-center"></div>
  </div>
</template>
