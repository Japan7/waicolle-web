<script setup lang="ts">
import type { CollageFilters } from "~/utils/waicolle";

const props = defineProps<{
  filters: CollageFilters;
}>();
const emit = defineEmits<{
  filtersUpdate: [filters: CollageFilters];
}>();
</script>

<template>
  <div class="grid grid-cols-2 grid-rows-3 grid-flow-row w-fit">
    <label class="space-x-1">
      <input
        type="checkbox"
        :checked="filters.unlockedOnly"
        @change="
          $emit('filtersUpdate', {
            ...filters,
            unlockedOnly: !filters.unlockedOnly,
          })
        "
      />
      <span>🔓 Unlocked</span>
    </label>
    <label class="space-x-1">
      <input
        type="checkbox"
        :checked="filters.lockedOnly"
        @change="
          emit('filtersUpdate', {
            ...filters,
            lockedOnly: !filters.lockedOnly,
          })
        "
      />
      <span>🔒 Locked</span>
    </label>
    <label class="space-x-1">
      <input
        type="checkbox"
        :checked="filters.ascendedOnly"
        @change="
          emit('filtersUpdate', {
            ...filters,
            ascendedOnly: !filters.ascendedOnly,
          })
        "
      />
      <span>⭐ Ascended</span>
    </label>
    <label class="space-x-1">
      <input
        type="checkbox"
        :checked="filters.nanaedOnly"
        @change="
          emit('filtersUpdate', {
            ...filters,
            nanaedOnly: !filters.nanaedOnly,
          })
        "
      />
      <span>🌈 Nanaed</span>
    </label>
    <label class="space-x-1">
      <input
        type="checkbox"
        :checked="filters.blooded"
        @change="
          emit('filtersUpdate', {
            ...filters,
            blooded: !filters.blooded,
          })
        "
      />
      <span>🩸 Blooded</span>
    </label>
    <label class="space-x-1">
      <input
        type="checkbox"
        :checked="filters.lasts"
        @change="
          emit('filtersUpdate', {
            ...filters,
            lasts: !filters.lasts,
          })
        "
      />
      <span>📆 ↓ Timestamp</span>
    </label>
  </div>
</template>
