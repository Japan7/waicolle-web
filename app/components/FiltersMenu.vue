<script setup lang="ts">
import type { WaifusData } from "~/utils/nanapi";
import type { CollageFilters } from "~/utils/waicolle";

const props = defineProps<{
  players?: WaifusData["players"];
  pending: boolean;
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
      v-if="players !== undefined"
      :players="players"
      :filters="filters"
      @filters-update="(f) => emit('filtersUpdate', f)"
    />
    <p v-else-if="pending">Loading players...</p>
    <p v-else>Error loading players.</p>

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
