<script setup lang="ts">
import { Waifu } from "server/utils/nanapi-client";
import { CollageFilters } from "utils/waicolle";

const route = useRoute();
const { data, pending } = useWaifus(route.params.clientId as string);

const filters = ref<CollageFilters>(DEFAULT_FILTERS);
const mediaCharas = ref<number[]>();
const selected = ref<Waifu>();
</script>

<template>
  <NuxtLayout>
    <CollageWaifus
      v-if="data && filters.players.length > 0"
      :waifus="data.waifus"
      :charas="data.charas"
      :filters="filters"
      :mediaCharas="mediaCharas"
      :selected="selected"
      @select="
        (waifu) => (selected = waifu.id === selected?.id ? undefined : waifu)
      "
    />
    <p v-else-if="data && filters.players.length === 0">
      Select at least one player.
    </p>
    <p v-else-if="pending">Loading waifus...</p>
    <p v-else>Error loading waifus.</p>

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
