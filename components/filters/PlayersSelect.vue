<script setup lang="ts">
import type { CollageFilters } from "~/utils/waicolle";

const props = defineProps<{
  filters: CollageFilters;
}>();
const emit = defineEmits<{
  filtersUpdate: [filters: CollageFilters];
}>();

const route = useRoute();
const { data, pending } = useLazyFetch("/api/waifus", {
  params: { clientId: route.params.clientId },
});

const sortedPlayers = computed(
  () =>
    data.value?.players.sort((a, b) =>
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
    <select v-if="data" multiple v-model="selected" class="select">
      <option
        v-for="p in sortedPlayers"
        :key="p.discord_id"
        :value="p.discord_id"
      >
        {{ p.discord_username }}
      </option>
    </select>
    <p v-else-if="pending">Loading players...</p>
    <p v-else>Error loading players.</p>
  </div>
</template>
