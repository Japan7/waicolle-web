<script lang="ts" setup>
import { useStorage } from "@vueuse/core";
import type { Waifu } from "~/server/utils/nanapi-client";
// TODO: Maybe useStorage?
import { DEFAULT_TRACKED_ORDERS } from "~/utils/waicolle";

useHead({
  titleTemplate: "Tracked | %s",
});

const route = useRoute();
const { data, pending } = useLazyFetch("/api/waifus", {
  params: { clientId: route.params.clientId },
});

const sortedPlayers = computed(
  () =>
    data.value?.players.toSorted((a, b) =>
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
          <div class="flex flex-col items-center">
            <span> 👥 Group by </span>
            <select v-if="data" v-model="filters.groupBy" class="select">
              <option
                v-for="order in DEFAULT_TRACKED_ORDERS"
                :key="order.displayName"
                :value="order"
              >
                {{ order.displayName }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <p>Player</p>
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
        <Infos
          v-if="selected"
          :waifus="data?.waifus"
          :players="data?.players"
          :pending="pending"
          :waifu="selected"
        />
      </template>
    </NuxtLayout>
  </div>
</template>
