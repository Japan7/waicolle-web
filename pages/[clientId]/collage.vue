<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import type { Waifu } from "~/server/utils/nanapi-client";

useHead({
  titleTemplate: "Collage | %s",
});

const route = useRoute();
const { data, pending } = useLazyFetch("/api/waifus", {
  params: { clientId: route.params.clientId },
});

const filters = useStorage(
  "collage-filters",
  DEFAULT_COLLAGE_FILTERS,
  localStorage,
  { mergeDefaults: true }
);
const mediaCharas = ref<number[]>();
const selected = ref<Waifu>();
</script>

<template>
  <div>
    <NuxtLayout>
      <template v-slot="slotProps">
        <CollageWaifus
          v-if="data && filters.players.length > 0"
          :waifus="data.waifus"
          :charas="data.charas"
          :filters="filters"
          :media-charas="mediaCharas"
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
        <p v-else-if="data && filters.players.length === 0">
          Select at least one player.
        </p>
        <p v-else-if="pending">Loading waifus...</p>
        <p v-else>Error loading waifus.</p>
      </template>
      <template #menu>
        <FiltersMenu
          :players="data?.players"
          :pending="pending"
          :filters="filters"
          :media-charas="mediaCharas"
          @filters-update="(newFilters) => (filters = newFilters)"
          @media-charas-update="
            (newMediaCharas) => (mediaCharas = newMediaCharas)
          "
        />
      </template>
      <template #side>
        <Infos
          v-if="selected"
          :waifus="data?.waifus"
          :players="data?.players"
          :pending="pending"
          :waifu="selected"
          :media-cursor-pointer="true"
          @media-id-select="(id) => (filters = { ...filters, mediaId: id })"
        />
      </template>
    </NuxtLayout>
  </div>
</template>
