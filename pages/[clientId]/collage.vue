<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { Waifu } from "server/utils/nanapi-client";

useHead({
  titleTemplate: "Collage | %s",
});

const route = useRoute();
const { data, pending } = useWaifus(route.params.clientId as string);

const filters = useStorage("collage-filters", DEFAULT_FILTERS, localStorage, {
  mergeDefaults: true,
});
const mediaCharas = ref<number[]>();
const selected = ref<Waifu>();
</script>

<template>
  <NuxtLayout>
    <template v-slot="slotProps">
      <CollageWaifus
        v-if="data && filters.players.length > 0"
        :waifus="data.waifus"
        :charas="data.charas"
        :filters="filters"
        :mediaCharas="mediaCharas"
        :selected="selected"
        :scrollDiv="slotProps.contentDiv"
        @setSelected="
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
        :filters="filters"
        :mediaCharas="mediaCharas"
        @setFilters="(newFilters) => (filters = newFilters)"
        @setMediaCharas="(newMediaCharas) => (mediaCharas = newMediaCharas)"
      />
    </template>

    <template #side>
      <Infos v-if="selected" :waifu="selected" />
    </template>
  </NuxtLayout>
</template>