<script setup lang="ts">
import type { CollageFilters } from "~/utils/waicolle";

const props = defineProps<{
  filters: CollageFilters;
  mediaCharas?: number[];
}>();
const emit = defineEmits<{
  filtersUpdate: [filters: CollageFilters];
  mediaCharasUpdate: [charas: number[] | undefined];
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-y-2">
    <FiltersBaseSelect
      :filters="filters"
      @filters-update="(f) => emit('filtersUpdate', f)"
    />
    <FiltersPlayersSelect
      :filters="filters"
      @filters-update="(f) => emit('filtersUpdate', f)"
    />
    <FiltersMediaSelect
      :filters="filters"
      :media-charas="mediaCharas"
      :infos-div="($refs.infosDiv as HTMLDivElement | undefined)"
      @filters-update="(f) => emit('filtersUpdate', f)"
      @media-charas-update="(mc) => emit('mediaCharasUpdate', mc)"
    />
    <div ref="infosDiv" class="text-center"></div>
  </div>
</template>
