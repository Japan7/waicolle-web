<script setup lang="ts">
import type { WaifusData } from "~/utils/nanapi";
import type { CollageFilters } from "~/utils/waicolle";

const props = defineProps<{
  players: WaifusData["players"];
  filters: CollageFilters;
}>();
const emit = defineEmits<{
  filtersUpdate: [filters: CollageFilters];
}>();

const sortedPlayers = computed(
  () =>
    props.players.toSorted((a, b) =>
      a.discord_username.localeCompare(b.discord_username)
    ) ?? []
);

const selected = computed({
  get() {
    return props.filters.players;
  },
  set(nv) {
    emit("filtersUpdate", {
      ...props.filters,
      players: nv,
    });
  },
});
</script>

<template>
  <div class="flex flex-col items-center">
    <select multiple v-model="selected" class="select">
      <option
        v-for="p in sortedPlayers"
        :key="p.discord_id"
        :value="p.discord_id"
      >
        {{ p.discord_username }}
      </option>
    </select>
  </div>
</template>
