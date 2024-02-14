<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
import type { Waifu } from "~/server/utils/nanapi-client";

useHead({
  titleTemplate: "Tracked | %s",
});

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

const filters = useStorage(
  "tracked-filters",
  DEFAULT_TRACKED_FILTERS,
  localStorage,
  {
    mergeDefaults: true,
  }
);
const selected = ref<Waifu>();
</script>

<template>
  <div>
    <NuxtLayout>
      <template v-slot="slotProps">
        <CollageTracked
          v-if="data && filters.player"
          :waifus="data.waifus"
          :charas="data.charas"
          :players="data.players"
          :filters="filters"
          :selected="selected"
          :scroll-div="slotProps.contentDiv"
          @select="
            (waifu) => {
              selected = waifu.id === selected?.id ? undefined : waifu;
              if (selected) {
                slotProps.openDrawer();
              }
            }
          "
        />
        <p v-else-if="data && !filters.player">Select a player.</p>
        <p v-else-if="pending">Loading waifus...</p>
        <p v-else>Error loading waifus.</p>
      </template>
      <template #menu>
        <div class="grid grid-cols-2 w-fit">
          <label class="space-x-1">
            <input
              type="checkbox"
              :checked="filters.hideSingles"
              @change="
                () =>
                  (filters = { ...filters, hideSingles: !filters.hideSingles })
              "
            />
            <span>☝️ Hide singles</span>
          </label>
          <label class="space-x-1">
            <input
              type="checkbox"
              :checked="filters.lasts"
              @change="() => (filters = { ...filters, lasts: !filters.lasts })"
            />
            <span>📆 ↓ Timestamp</span>
          </label>
        </div>
        <div class="flex flex-col items-center">
          <select v-if="data" v-model="filters.player" class="select">
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
      <template #side>
        <Infos v-if="selected" :waifu="selected" />
      </template>
    </NuxtLayout>
  </div>
</template>
