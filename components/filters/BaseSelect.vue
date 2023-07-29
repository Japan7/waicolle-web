<script setup lang="ts">
import { CollageFilters } from "utils/waicolle";

const props = defineProps<{
  filters: CollageFilters;
}>();
const emit = defineEmits<{
  setFilters: [filters: CollageFilters];
}>();
</script>

<template>
  <div class="grid grid-cols-2 grid-rows-3 grid-flow-row w-fit">
    <label class="space-x-1">
      <input
        type="checkbox"
        :defaultChecked="filters.unlockedOnly"
        @change="
          $emit('setFilters', {
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
        :defaultChecked="filters.lockedOnly"
        @change="
          $emit('setFilters', {
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
        :defaultChecked="filters.ascendedOnly"
        @change="
          $emit('setFilters', {
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
        :defaultChecked="filters.nanaedOnly"
        @change="
          $emit('setFilters', {
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
        :defaultChecked="filters.blooded"
        @change="
          $emit('setFilters', {
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
        :defaultChecked="filters.lasts"
        @change="
          $emit('setFilters', {
            ...filters,
            lasts: !filters.lasts,
          })
        "
      />
      <span>📆 ↓ Timestamp</span>
    </label>
  </div>
</template>
